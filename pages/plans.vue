<template>
  <StandardLayout>
    <v-container fluid class="ma-1">
      <v-row cols="12" md="auto" class="display-2">
        Pricing
      </v-row>
      <v-divider class="my-5" />
      <v-row justify="center">
        <v-col v-for="(plan, i) in plans" :key="i" cols="12" md="12">
          <v-card class="object pb-2" flat outlined height="100%">
            <v-img
              :src="plan.image"
              max-height="200"
              class="grey lighten-5 black--text lighten--text-3 py-10"
            >
              <v-card-text class="text-center">
                <div class="display-2 font-weight-bold">
                  {{ plan.name }}
                </div>
                <div class="title text-uppercase">
                  {{ plan.tagline }}
                </div>
              </v-card-text>
            </v-img>

            <v-divider />

            <v-card-text class="px-0">
              <v-row justify="space-around" align="start">
                <v-col cols="12" md="auto">
                  <v-list class="text-left" disabled>
                    <v-list-item-group>
                      <v-list-item v-for="(feature, j) in plan.features" :key="j">
                        <v-list-item-avatar>
                          <v-icon color="success">
                            mdi-check-circle
                          </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-title>
                          {{ feature }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-col>

                <v-col cols="12" md="6" class="text-center black--text">
                  <v-row v-for="(billing, i) in plan.billing" :key="i">
                    <v-col cols="12">
                      <div class="title text-uppercase">
                        {{ billing.name }}
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <span class="headline font-weight-bold">{{ billing.price | currency }}</span>
                      <span> / {{ billing.cycle }} </span>
                      <br />
                      <span v-if="billing.extras">+ {{ billing.extras | currency }}</span>
                      <span v-if="billing.feature">
                        {{ billing.feature }}
                      </span>
                    </v-col>
                    <v-col cols="12">
                      <v-btn
                        width="400px"
                        max-width="95%"
                        class="my-4 mx-auto"
                        color="info"
                        x-large
                        @click="viewPlans(plan)"
                      >
                        select plan
                      </v-btn>
                    </v-col>
                    <v-col v-if="i < plan.billing.length - 1" cols="12">
                      <v-divider />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="text-center" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </StandardLayout>
</template>

<script>
import StandardLayout from "@/layouts/StandardLayout"

export default {
  name: "Plan",
  components: {
    StandardLayout,
  },
  filters: {
    currency(value) {
      return " ₹" + value
    },
  },
  head() {
    return {
      title: "Plans",
    }
  },
  data() {
    return {
      plans: [
        {
          name: "Basic",
          image: require("@/assets/images/bg/basic.png"),
          tagline: "first 5 tests free",
          features: [
            "Fully customized software",
            "eTests subdomain",
            "Hosting included",
            "Admin Dashboard",
            "Conduct online tests",
            "24*7 support ",
          ],
          billing: [
            {
              name: "monthly",
              cycle: "month",
              price: "600",
              extras: "7 per student for each test",
              feature: "",
            },
            {
              name: "half-yearly",
              cycle: "6 months",
              price: "3000",
              extras: "7 per student for each test",
              feature: "",
            },
            {
              name: "yearly",
              cycle: "year",
              price: "5000",
              extras: "7 per student for each test",
              feature: "",
            },
          ],
        },
        {
          name: "Standard",
          image: require("@/assets/images/bg/standard.png"),
          tagline: "50 tests per year",
          features: [
            "Fully customized software",
            "eTests subdomain",
            "Hosting included",
            "Admin Dashboard",
            "Conduct online tests",
            "24*7 support ",
          ],
          billing: [
            {
              name: "monthly",
              cycle: "month",
              price: "1000",
              extras: "",
              feature: "2 online tests",
            },
            {
              name: "half-yearly",
              cycle: "6 months",
              price: "5000",
              extras: "",
              feature: "15 online tests",
            },
            {
              name: "yearly",
              cycle: "year",
              price: "10000",
              extras: "",
              feature: "50 online tests",
            },
          ],
        },
        {
          name: "Enterprise",
          image: require("@/assets/images/bg/enterprise.png"),
          tagline: "Unlimited tests",
          features: [
            "Fully customized software",
            "eTests subdomain",
            "Hosting included",
            "Admin Dashboard",
            "Conduct online tests",
            "24*7 support ",
          ],
          billing: [
            {
              name: "monthly",
              cycle: "month",
              price: "2000",
              extras: "",
              feature: "Unlimited online tests",
            },
            {
              name: "half-yearly",
              cycle: "6 months",
              price: "10000",
              extras: "",
              feature: "Unlimited online tests",
            },
            {
              name: "yearly",
              cycle: "year",
              price: "15000",
              extras: "",
              feature: "Unlimited online tests",
            },
          ],
        },
      ],
    }
  },
  methods: {
    viewPlans(item) {
      this.plans = item.billing
    },
  },
}
</script>
