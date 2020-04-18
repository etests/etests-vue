<template>
  <div />
</template>

<script>
export default {
  props: ["dialog", "testSeries"],
  data() {
    return {
      transactionId: ""
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    options() {
      return {
        key: "rzp_live_UDqxbWjZnzcTp4",
        amount: this.testSeries.price * 100,
        name: "eTests",
        currency: "INR",
        description: `Buy ${this.testSeries.name}`,
        image: "https://etests.co.in/img/etests.65141f79.png",
        handler: (response) => {
          this.verifySignature(response)
        },
        prefill: {
          name: this.user.name,
          contact: this.user.profile.phone,
          email: this.user.email
        },
        notes: {
          address: ""
        },
        theme: {
          color: "#2dcc9e"
        },
        modal: {
          ondismiss: (_) => {
            this.$emit("close")
          }
        }
      }
    }
  },
  watch: {
    dialog(newValue, oldValue) {
      if (newValue) {
        const rzp = new Razorpay(this.options)
        rzp.open()
      }
    }
  },
  mounted() {
    const razorpayCheckout = document.createElement("script")
    razorpayCheckout.setAttribute("src", "https://checkout.razorpay.com/v1/checkout.js")
    document.head.appendChild(razorpayCheckout)
  },
  methods: {
    verifySignature(response) {
      this.transactionId = response.razorpay_payment_id
      const data = {
        testSeries: this.testSeries.id,
        amount: this.testSeries.price,
        transactionId: this.transactionId
      }
      this.$store.cache.dispatch("payments/create", data).then(
        (_) => {
          this.$emit("submit")
          this.$emit("close")
        },
        (error) => {}
      )
    }
  }
}
</script>
