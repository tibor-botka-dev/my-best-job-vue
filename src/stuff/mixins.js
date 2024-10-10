import { EventBus } from "./event-bus";
import moment from "moment";

const mixins = {
    install(Vue) {
        Vue.mixin({
            computed: {
                regexPatterns() {
                    return this.$store.state.regexPatterns;
                }
            },
            methods: {
                setTitle() {
                    this.$store.commit("setTitle", this.title);
                },
                showToast(title, message, data = null, options = null) {
                    const h = this.$createElement;
                    var array = [];

                    if (data?.errors && typeof data.errors == "object")
                        for (const [_key, value] of Object.entries(data.errors)) {
                            this.addElement(h, array, value);
                        }
                    else if (typeof data == "string")
                        this.addElement(h, array, data);
                    else if (data?.value)
                        this.addElement(h, array, data.value);


                    if (!array.length)
                        this.addElement(h, array, message);

                    const toastMessage = h("div", array);
                    this.$bvToast.toast([toastMessage],
                        {
                            title: title,
                            toaster: options?.toaster ?? "b-toaster-top-right",
                            autoHideDelay: options?.autoHideDelay ?? 5000,
                            variant: options?.variant ?? "danger",
                            solid: options?.solid ?? true,
                            appendToast: options?.appendToast ?? false,
                            noAutoHide: options?.noAutoHide ?? false,
                        }
                    );
                },
                addElement(h, array, value) {
                    array.push([
                        h(
                            "p",
                            {
                                class: "font-weight-bold",
                            },
                            value
                        ),
                    ])
                },
                confirmMessageModal(message, title, options = null) {
                    const h = this.$createElement;
                    const modalMessage = h("p", {
                        class: "font-weight-bold",
                        domProps: {
                            innerHTML:
                                message,
                        },
                    });

                    this.$bvModal.msgBoxConfirm(
                        modalMessage,
                        {
                            title: title,
                            size: options?.size ?? "lg",
                            okTitle: options?.okTitle ?? "Igen",
                            okVariant: options?.okVariant ?? "primary",
                            cancelTitle: options?.cancelTitle ?? "Nem",
                            cancelVariant: options?.cancelVariant ?? "danger",
                            headerBgVariant: options?.headerBgVariant ?? "primary",
                            headerClass: options?.headerClass ?? "text-light",
                            bodyClass: options?.bodyClass ?? "text-light",
                            bodyBgVariant: options?.bodyBgVariant ?? "dark",
                            footerBgVariant: options?.footerBgVariant ?? "dark",
                            centered: options?.centered ?? true,
                            noCloseOnBackdrop: options?.noCloseOnBackdrop ?? true,
                            noCloseOnEsc: options?.noCloseOnEsc ?? true
                        }
                    ).then((value) => {
                        if (value && options?.onOk) {
                            options.onOk();
                        } else if (!value && options?.onCancel) {
                            options.onCancel();
                        }
                    });
                },
                showLoading(show, title) {
                    EventBus.$emit(show ? "show-loading" : "hide-loading", {
                        title: title,
                    });
                },
                dateFormat(date) {
                    if (!date) {
                        return "-";
                    }

                    return moment(new Date(date)).format("YYYY-MM-DD");
                },
                dateFormatUtc(date) {
                    if (!date) {
                        return;
                    }

                    return moment(new Date(date)).utc();
                },
                salaryFormat(salary) {
                    if (salary.length == 5 && salary.includes(".")) {
                        return salary.replace(".", "");
                    }

                    if (salary.length >= 5) {
                        return salary
                            .replace(/\D/g, "")
                            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ".");
                    }

                    return salary;
                },
                checkNumber(e) {
                    if (!this.regexPatterns.number.test(e.key.toLowerCase()))
                        e.preventDefault();
                },
                showPassword(passwordType) {
                    return passwordType == "password" ? "text" : "password";
                },
                projectColorIsDark(hexColor) {
                    let isDark = false;
                    var rgbColor = parseInt(hexColor.substring(1), 16);
                    var r = (rgbColor >> 16) & 0xff;
                    var g = (rgbColor >> 8) & 0xff;
                    var b = (rgbColor >> 0) & 0xff;

                    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    if (luma <= 50) {
                        isDark = true;
                    }

                    return isDark;
                },
            },
        });
    },
};

export default mixins;