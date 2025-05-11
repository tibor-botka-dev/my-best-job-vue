<template>
  <section class="hero-area style4">
    <!-- Single Slider -->
    <div class="hero-inner">
      <div class="container">
        <div class="row ">
          <div class="col-lg-10 offset-lg-1 co-12">
            <div class="inner-content">
              <div class="hero-text">
                <h1 class="wow fadeInUp" data-wow-delay=".3s">Find the Most Exciting<br> Jobs to Make a Better Life
                </h1>
                <p class="wow fadeInUp" data-wow-delay=".5s">Creating a beautiful job website is not
                  easy always. To make your life easier,<br> we are introducing Jobcamp template, Leverage agile
                  frameworks to provide a <br>robust synopsis for high level overviews.
                </p>
                <div class="button wow fadeInUp" data-wow-delay=".7s">
                  <a href="post-job.html" class="btn">Post a Job</a>
                  <a href="browse-jobs.html" class="btn btn-alt">See Our Jobs</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="job-search-wrap-two">
              <div class="job-search-form">
                <form action="#">
                  <!-- Single Field Item Start  -->
                  <div class="single-field-item keyword">
                    <label for="keyword">What</label>
                    <input id="keyword" placeholder="What jobs you want?" name="keyword" type="text">
                  </div>
                  <!-- Single Field Item End  -->
                  <!-- Single Field Item Start  -->
                  <div class="single-field-item location">
                    <label for="location">Where</label>
                    <input id="location" class="input-field input-field-location" placeholder="Location" name="location"
                      type="text">
                  </div>
                  <!-- Single Field Item End  -->
                  <div class="submit-btn">
                    <button class="btn" type="submit">Search</button>
                  </div>
                </form>
              </div>
              <div class="trending-keywords mt-30">
                <div class="keywords style-two">
                  <span class="title">Popular Keywords:</span>
                  <ul>
                    <li><a href="#">Administrative</a></li>
                    <li><a href="#">Android</a></li>
                    <li><a href="#">app</a></li>
                    <li><a href="#">ASP.NET</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--/ End Single Slider -->
  </section>

  <!-- <div class="row py-5 text-center">
    <div class="col-12 col-md-5">
      <p class="font-weight-bold">{{ $t("Állást keres?") }}</p>
      <p>{{ $t('Találja meg az Ön igényeinek legmegfelelőbb állást AI segítségével.'
        + ' Adjon meg pár információt magáról és az AI segít feltérképezni, kiszűrni a legjobb állásokat.') }}</p>
      <button type="button" class="btn btn-lg btn-primary" @click="getJobs()">
        <i class="fas fa-search"></i>
        {{ $t("Állást keresek") }}
      </button>
    </div>

    <div class="col-12 col-md-2 mt-n5">
      <img class="w-100" src="../assets/img/logo.png" alt="My Best Job logo" />
    </div>

    <div class="col-12 col-md-5">
      <p class="font-weight-bold">{{ $t("Állást kínál?") }}</p>
      <p>{{ $t('Találja meg az Ön igényeinek legmegfelelőbb munkaerőt AI segítségével.'
        + ' Adjon meg pár információt cégéről és az AI segít megtalálni a legjobb munkaerőt.') }}</p>
      <button type="button" class="btn btn-lg btn-primary" @click="getJobs()">
        <i class="fas fa-upload"></i>
        {{ $t("Állást adok fel") }}
      </button>
    </div>
  </div> -->
</template>

<script>
export default {
  data() {
    return {
      title: "Főoldal"
    };
  },
  mounted() {
    this.setTitle();
  }
};
</script>