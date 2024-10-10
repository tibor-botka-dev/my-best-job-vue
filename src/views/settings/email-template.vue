<template>
    <div class="row">
        <div class="col-md-12">
            <b-dropdown class="mr-3" v-model="emailTemplate.emailTemplateType" :text="emailTemplate.name"
                variant="info">
                <div v-for="emailTemplate in emailTemplates.emailTemplates" :key="emailTemplate.emailTemplateType">
                    <b-dropdown-item-button @click="emailTemplateTypeClick(emailTemplate.emailTemplateType)">
                        {{ emailTemplate.name }}
                    </b-dropdown-item-button>
                </div>
            </b-dropdown>

            <div v-if="emailTemplate.emailTemplateType" class="form-group">
                <label for="subject">
                    Email tárgya
                </label>
                <input id="subject" class="form-control" v-model="emailTemplate.subject" />
                <input-footer :validation="emailTemplateValidationMessages.subject"
                    message="Email tárgya mező minimum 1 karakter lehet" tooltip="1-50 karakter hosszú lehet" />
            </div>

            <button v-if="emailTemplate.emailTemplateType" type="button" class="btn btn-primary"
                @click="updateEmailTemplate">
                <i class="fas fa-envelope-open-text"></i>
                Sablon mentése
            </button>
        </div>

        <div v-if="emailTemplate.emailTemplateType" class="col-md-6 mt-3">
            <label for="html-template">
                Email html sablon
            </label>
            <textarea id="html-template" class="form-control" rows="20" v-model="emailTemplate.htmlTemplate"></textarea>
        </div>

        <div v-if="emailTemplate.emailTemplateType" class="col-md-6 mt-3">
            <span v-html="emailTemplate.htmlTemplate"></span>
        </div>

        <hr class="divider" />

        <div class="col-md-12 mb-2">
            <h6 class="text-secondary text-justify">Az alábbi változó adatokat elhelyezheti a szövegben. Például
                "Kedves,
                <strong class="text-primary">--user-name--</strong>!"
                Ebben az esetben az adott felhasználó neve fog megjelenni a <strong
                    class="text-primary">'--user-name--'</strong> helyén az emailben.
                Fontos, hogy a html sablonban <strong class="text-danger">a változót tegyük '--' írásjelek
                    közé.</strong>
            </h6>
        </div>

        <div class="col-md-6">
            <label for="email-template-value-key">
                Új változó 'kulcs'
                <span class="h4 text-danger">
                    <strong>*</strong>
                </span>
            </label>
            <input id="email-template-value-key" type="text" class="form-control" v-model="newEmailTemplateValue.key"
                autocomplete="off" required />
            <input-footer :validation="newValueValidationMessages.key" message="Új változó 'kulcs' mező kötelező"
                tooltip="1-100 karakter hosszú lehet -- írásjelek között. Az Új változó 'érték' mezőre cseréljük ki." />

            <label for="email-template-value-name">
                Új változó neve
                <span class="h4 text-danger">
                    <strong>*</strong>
                </span>
            </label>
            <input id="email-template-value-name" type="text" class="form-control" v-model="newEmailTemplateValue.name"
                autocomplete="off" required />
            <input-footer :validation="newValueValidationMessages.name" message="Új változó neve mező kötelező"
                tooltip="1-100 karakter hosszú lehet. Például 'Felhasználó neve'." />

            <label for="email-template-value">
                Új változó 'érték'
                <span class="h4 text-danger">
                    <strong>*</strong>
                </span>
            </label>
            <input id="email-template-value" type="text" class="form-control" v-model="newEmailTemplateValue.value"
                autocomplete="off" required />
            <input-footer :validation="newValueValidationMessages.value" message="Új változó érték mező kötelező"
                tooltip="1-300 karakter hosszú lehet. Például 'Gipsz Jakab'." />

            <div class="mt-4 text-center">
                <button type="button" class="btn btn-primary" @click="createEmailTemplateValue">
                    <i class="fas fa-plus"></i>
                    Hozzáad
                </button>
            </div>
        </div>

        <div v-if="emailTemplates.emailTemplateValues.some(x => x.isRequired)" class="col-md-6">
            <h6>Fix változók - <strong class="text-danger">nem szerkeszthető</strong></h6>
            <div class="input-group input-group-sm mt-3"
                v-for="(emailTemplateValue, index) in emailTemplates.emailTemplateValues.filter(x => x.isRequired)"
                :key="index">
                <div class="input-group-prepend">
                    <span class="input-group-text font-weight-bold text-primary">{{ emailTemplateValue.key }}</span>
                </div>
                <div class="input-group-append">
                    <span class="input-group-text">{{ emailTemplateValue.name }}</span>
                </div>
            </div>
        </div>

        <div v-if="emailTemplates.emailTemplateValues.some(x => !x.isRequired)" class="col-md-12 mt-3">
            <h6>Saját változók - <strong class="text-danger">szerkeszthető</strong></h6>
            <div class="input-group input-group-sm mt-3"
                v-for="(emailTemplateValue, i) in emailTemplates.emailTemplateValues.filter(x => !x.isRequired)"
                :key="emailTemplateValue.key">
                <div class="input-group-prepend">
                    <span class="input-group-text font-weight-bold text-primary">{{ emailTemplateValue.key }}</span>
                </div>

                <input :id="`edit-email-template-value-name-${i}`" type="text" class="form-control"
                    v-model="emailTemplateValue.name" required autocomplete="off" />
                <b-tooltip :target="`edit-email-template-value-name-${i}`"><strong class="text-danger">Változó
                        neve.</strong> 1-100 karakter hosszú lehet.
                    Például
                    'Felhasználó
                    neve'.</b-tooltip>
                <input-footer :validation="editValueValidationMessages.name" message="Változó neve kötelező" />

                <input :id="`edit-email-template-value-${i}`" type="text" class="form-control"
                    v-model="emailTemplateValue.value" required autocomplete="off" />
                <b-tooltip :target="`edit-email-template-value-${i}`"><strong class="text-danger">Változó
                        értéke.</strong> 1-300 karakter hosszú lehet.
                    Például 'Gipsz
                    Jakab'.</b-tooltip>
                <input-footer :validation="editValueValidationMessages.value" message="Változó értéke kötelező" />

                <div class="input-group-append">
                    <button type="button" class="btn btn-primary"
                        @click="updateEmailTemplateValue(emailTemplateValue.key)">
                        <i class="fas fa-edit"></i>
                        Mentés
                    </button>

                    <button type="button" class="btn btn-danger"
                        @click="removeEmailTemplateValue(emailTemplateValue.key)">
                        <i class="fas fa-trash"></i>
                        Törlés
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import settingService from "../../services/setting-service";
import { mapState } from "vuex";

export default {
    data() {
        return {
            emailTemplates: {
                emailTemplateValues: [],
                emailTemplates: [],
            },
            emailTemplate: {
                emailTemplateType: null,
                name: "Válasszon sablont",
                subject: null,
                htmlTemplate: null
            },
            newEmailTemplateValue: {
                key: null,
                name: null,
                value: null
            },
            template: {
                emailTemplateType: null,
                subject: null,
                jsonTemplate: null,
                htmlTemplate: null,
                emailTemplateValues: []
            },
            editValueSubmitted: null,
            newValueSubmitted: null,
            emailTemplateSubmitted: null
        };
    },
    computed: {
        ...mapState(["initialized"]),
        emailTemplateValidationMessages() {
            var result = [];
            if (!this.emailTemplateSubmitted)
                return result;

            result["subject"] = !this.regexPatterns.emailTemplateSubject.test(this.emailTemplate.subject);

            return result;
        },
        editValueValidationMessages() {
            var result = [];
            if (!this.editValueSubmitted)
                return result;

            result["name"] = !this.regexPatterns.name.test(this.mailSetting.email);
            result["value"] = !this.regexPatterns.emailTemplateValue.test(this.mailSetting.email);

            return result;
        },
        newValueValidationMessages() {
            var result = [];
            if (!this.newValueSubmitted)
                return result;

            result["key"] = !this.regexPatterns.emailTemplateKey.test(this.newEmailTemplateValue.key);
            result["name"] = !this.newEmailTemplateValue.name || !this.regexPatterns.emailTemplateName.test(this.newEmailTemplateValue.name);
            result["value"] = !this.newEmailTemplateValue.value || !this.regexPatterns.emailTemplateValue.test(this.newEmailTemplateValue.value);

            return result;
        },
    },
    methods: {
        async initialize() {
            this.showLoading(true, "Email sablonok betöltése...");
            const response = await settingService.getEmailTemplates();
            this.showLoading();

            if (!response.isSuccessStatusCode) {
                this.showToast(
                    "Hiba az email sablonok lekérdezésekor",
                    "Email sablonok lekérdezése nem sikerült",
                    response.data
                );

                return;
            }

            this.emailTemplates = response.data?.emailTemplates;
            this.newEmailTemplateValue.key = null;
            this.newEmailTemplateValue.name = null;
            this.newEmailTemplateValue.value = null;
            this.newValueSubmitted = null;
        },
        async createEmailTemplateValue() {
            this.newValueSubmitted = true;
            if (Object.values(this.newValueValidationMessages).includes(true))
                return;

            this.showLoading(true, "Változó adat hozzáadása...");
            const response = await settingService.createEmailTemplateValue(this.newEmailTemplateValue);
            this.showLoading();

            if (!response.isSuccessStatusCode) {
                this.showToast(
                    "Hiba a változó adat létrehozásakor",
                    "Változó adat létrehozása nem sikerült",
                    response.data
                );

                return;
            }

            this.showToast(
                "Változó adat létrehozása sikeres",
                "Változó adat létrehozva.",
                null,
                { variant: "success" }
            );

            await this.initialize();
        },
        async updateEmailTemplateValue(key) {
            this.editValueSubmitted = true;
            if (Object.values(this.newValueValidationMessages).includes(true))
                return;

            var emailTemplateValue = this.emailTemplates.emailTemplateValues.find(x => x.key == key);

            this.showLoading(true, "Változó adat mentése...");
            var editEmailTemplateValue = Object.assign(emailTemplateValue);
            const response = await settingService.updateEmailTemplateValue(key, editEmailTemplateValue);
            this.showLoading();

            if (!response.isSuccessStatusCode) {
                this.showToast(
                    "Hiba a változó adat mentésekor",
                    "Változó adat mentése nem sikerült",
                    response.data
                );

                return;
            }

            this.showToast(
                "Változó adat mentése sikeres",
                "Változó adat frissítve.",
                null,
                { variant: "success" }
            );

            await this.initialize();
        },
        async removeEmailTemplateValue(key) {
            this.showLoading(true, "Változó adat törlése...");
            const response = await settingService.deleteEmailTemplateValue(key);
            this.showLoading();

            if (!response.isSuccessStatusCode) {
                this.showToast(
                    "Hiba a változó adat törlésekor",
                    "Változó adat törlése nem sikerült",
                    response.data
                );

                return;
            }

            this.showToast(
                "Változó adat törlése sikeres",
                "Változó adat törölve.",
                null,
                { variant: "success" }
            );

            await this.initialize();
        },
        async updateEmailTemplate() {
            var data = {
                subject: this.emailTemplate.subject,
                htmlTemplate: this.emailTemplate.htmlTemplate
            };

            this.showLoading(true, "Email sablon mentése...");
            const response = await settingService.updateEmailTemplate(this.emailTemplate.emailTemplateType, data);
            this.showLoading();

            if (response.isSuccessStatusCode) {
                this.showToast(
                    "Email sablon mentése sikeres",
                    "Email sablon frissítve.",
                    null,
                    { variant: "success" }
                );

                return;
            }

            this.showToast(
                "Hiba az email sablon mentésekor",
                "Email sablon mentése nem sikerült",
                response.data
            );
        },
        emailTemplateTypeClick(emailTemplateType) {
            var emailTemplate = this.emailTemplates.emailTemplates.find((x) => x.emailTemplateType == emailTemplateType);
            if (emailTemplate == null)
                return;

            this.emailTemplate = emailTemplate;
        },
    },
    watch: {
        async initialized(newValue, oldValue) {
            if (newValue && newValue != oldValue)
                await this.initialize();
        },
    },
};
</script>