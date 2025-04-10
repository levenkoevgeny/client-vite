<template>
  <navigation-layout></navigation-layout>

  <div>
    <div class="px-3">
      <div
        class="min-vh-100 d-flex align-items-center justify-content-center p-5 row"
      >
        <div class="col-xxl-8 col-xl-10 col-12">
          <div class="justify-content-center align-items-center g-5 row">
            <div class="text-center order-lg-1 col-lg-6 col-12">
              <img src="../../assets/404.png" alt="404.png" class="img-fluid" />
            </div>
            <div class="text-center text-lg-start col-lg-6 col-12">
              <h2
                class="text-body-secondary fw-bolder mb-3"
                style="font-size: 70px"
              >
                404
              </h2>
              <h2 class="text-body-secondary fw-bolder mb-3">
                Страница не найдена!
              </h2>
              <a role="button" href="/" class="btn btn-primary btn-lg"
                >На главную</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"

export default {
  name: "NotFoundView",
  components: { NavigationLayout },
}
</script>

<style scoped></style>
