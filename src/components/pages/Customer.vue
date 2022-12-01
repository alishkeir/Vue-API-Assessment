<template>
  <div class="container customer">
    <img src="../../assets/images/avatar.png" class="customer-image" v-if="this.dataAvailable" />

    <div class="customer-details  mt-4" v-if="this.dataAvailable">
      <table class="table customer-details-table">
        <tbody class="customer-details-table-body">
          <tr v-if="userData?.Player" class="customer-details-table-body-row">
            <th>Name</th>
            <td>{{ userData.Player }}</td>
          </tr>

          <tr v-if="userData?.AgeThatYear" class="customer-details-table-body-row">
            <th>Age <span v-if="userData.Year">in {{ userData.Year }}</span></th>
            <td>{{ userData.AgeThatYear }}</td>
          </tr>

          <tr v-if="userData?.Rank" class="customer-details-table-body-row">
            <th>Rank</th>
            <td>{{ userData.Rank }}</td>
          </tr>

          <tr v-if="userData?.Hits" class="customer-details-table-body-row">
            <th>Hits</th>
            <td>{{ userData.Hits }}</td>
          </tr>

          <tr v-if="userData?.Bats" class="customer-details-table-body-row">
            <th>Bats</th>
            <td>{{ userData.Bats }}</td>
          </tr>
        </tbody>
      </table>
    </div>


    <div v-if="this.userNotFound" class="customer-not-found">

      <img src="../../assets/images/unknown.png" class="customer-image customer-not-found-image" />

      <h2 class="mt-5 customer-not-found-message">User not available</h2>
    </div>


    <router-link v-if="(this.dataAvailable || this.userNotFound)" :to="`/`"
      class="btn btn-primary mt-2 customer-actions">
      Back
    </router-link>
  </div>

</template>



<script>
export default {
  name: 'CustomerDetails',
  //describe the data that's inside this component
  data() {
    return {
      userData: {}, //  user data object
      dataAvailable: false, //  to not display anything before the api is called (it's not necessary but I am using local image -- it will be shown even if the user is 404 and will be hidden after the error)
      userNotFound: false,// if the user is 404 -- to display error message
    }
  },

  // fires when the component mounts in the DOM
  mounted() {
    fetch(`https://api.sampleapis.com/baseball/hitsSingleSeason/${this.$route.params.id}`)
      .then((res) => {

        this.dataAvailable = true;

        // if the user is not found display 404 message
        if (res.status !== 200) {
          this.dataAvailable = false;
          this.userNotFound = true;
        }

        return res.json();
      })
      .then((data) => {
        this.userData = data
      })
      .catch((err) => {
        console.log(err.message);
        this.dataAvailable = false;
        this.userNotFound = true;
      })

  }

}
</script>

<style scoped>
.customer-image,
.customer-details {
  max-width: 30rem;
  width: 100%;
}

.customer-details {
  margin-left: auto;
  margin-right: auto;
}
</style>