<template>
  <div>
    <navigation-layout>
      <template v-slot:menu>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link active" :to="{ name: 'navigation' }">
                Раздел навигации
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'employee' }">
                Главная
              </router-link>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Подразделы
              </a>
              <ul class="dropdown-menu">
                <!--                <li class="nav-item">-->
                <!--                  <router-link class="nav-link" :to="{ name: 'encouragement' }">-->
                <!--                    Поощрения-->
                <!--                  </router-link>-->
                <!--                </li>-->
                <!--                <li class="nav-item">-->
                <!--                  <router-link class="nav-link" :to="{ name: 'punishment' }">-->
                <!--                    Взыскания-->
                <!--                  </router-link>-->
                <!--                </li>-->
                <!--                <li class="nav-item">-->
                <!--                  <router-link class="nav-link" :to="{ name: 'positions' }">-->
                <!--                    Назначения на должности-->
                <!--                  </router-link>-->
                <!--                </li>-->
                <!--                <li class="nav-item">-->
                <!--                  <router-link-->
                <!--                    class="nav-link"-->
                <!--                    :to="{ name: 'rank-histories' }"-->
                <!--                  >-->
                <!--                    Присвоение званий-->
                <!--                  </router-link>-->
                <!--                </li>-->
                <!--                <li class="nav-item">-->
                <!--                  <router-link class="nav-link" :to="{ name: 'specialities' }">-->
                <!--                    Перевод на специальности-->
                <!--                  </router-link>-->
                <!--                </li>-->
                <!--                <li class="nav-item">-->
                <!--                  <router-link class="nav-link" :to="{ name: 'fired' }">-->
                <!--                    Уволенные-->
                <!--                  </router-link>-->
                <!--                </li>-->
              </ul>
            </li>
          </ul>
        </div>
      </template>
    </navigation-layout>
    <div class="container-fluid">
      <h2 class="mt-3">КИС "Сотрудники и гражданский персонал"</h2>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"
export default {
  name: "EmployeeMainView",
  components: { NavigationLayout },
}
</script>

<style scoped></style>
