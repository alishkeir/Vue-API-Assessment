
<template>

  <h1 class="title">Customers</h1>

  <form class="form-filter">
    <div class="row">
      <div class="field">
        <label for="filterState">Filter with</label>
        <select id="filterState" class="form-control" v-on:change="setFilterColumn">
          <option selected value="AgeThatYear">Age</option>
          <option value="Rank">Rank</option>
          <option value="Hits">Hits</option>
        </select>
      </div>

      <div class="field">
        <label for="MinValue">From</label>
        <input type="number" class="form-control" id="MinValue" min="0" value="0" v-on:change="setminFilterValue">
      </div>
      <div class="field">
        <label for="MaxValue">To</label>
        <input type="number" class="form-control" id="MaxValue" min="0" v-on:change="setmaxFilterValue">
      </div>
    </div>
  </form>


  <table class="table customers-table">
    <thead class="table-head">
      <tr class="table-head-row">

        <!-- Rank and Hits are clickable  -->
        <th v-for="column in columns" v-bind:key="column.index" scope="col" v-on:click="sortTable(column.index)">
          {{ column.name }}

          <!-- to display arrow depending on the sorting value (asc/desc) -->
          <div class="arrow" v-if="column.name == sortColumn" v-bind:class="ascending ? 'arrow_down' : 'arrow_up'">
          </div>
        </th>
      </tr>
    </thead>

    <tbody v-if="filteredCustomersArray.length > 0" class="table-body">
      <tr v-for="customer in paginated" :key="customer.id" class="table-body-row">
        <th scope="row">{{ customer.id }}</th>
        <td>{{ customer.Player }}</td>
        <td>{{ customer.AgeThatYear }}<span v-if="customer.Year"> ({{ customer.Year }})</span></td>
        <td>{{ customer.Rank }}</td>
        <td style>{{ customer.Hits }}</td>
        <td>
          <router-link :to="`/customer/${customer.id}`" class="btn btn-warning">
            Details
          </router-link>
        </td>
      </tr>
    </tbody>

    <!-- if the array is filtered and there is no values inside -->
    <h3 class="table-no-data" v-if="this.noCustomers || (this.filteredCustomersArray.length == 0 && this.filtered)">No
      records, please update
      your filters</h3>
  </table>

  <div class="pagination table-pagination d-flex justify-content-center mb-3" v-if="filteredCustomersArray.length">
    <button class="btn btn-primary pagination-btn" @click="prev"
      v-bind:class="this.current == 1 ? 'disabled' : ''">Prev</button>
    <button class="btn btn-primary pagination-btn" @click="next"
      v-bind:class="this.current == this.maxPages ? 'disabled' : ''">Next</button>
  </div>

</template>



<script>

export default {
  //describe the data that's inside this component
  data() {
    return {
      mainCustomersArray: [], // main array to be filled on api call
      filteredCustomersArray: [], // default array to be displayed -- not displaying the main array because it has to save the default values without losing them
      columns: [{ name: "ID", index: "id" }, { name: "Name", index: "Player" }, { name: "Age", index: "AgeThatYear" }, { name: "Rank", index: "Rank" }, { name: "Hits", index: "Hits" }, { name: "Action", index: "Action" }], // columns name -- it's better to use them like that to use the index(column name for the object key)
      ascending: false, // if the sorting is in asc or desc order
      sortColumn: '', // default name of the column to be sorted
      noCustomers: false, // display no records message if the api call returns 0 values
      filterColumn: "AgeThatYear", // default column name to be filtered
      minFilterValue: 0, // minimum filter value taken from the input -- it's always 0
      maxFilterValue: null, // max filter value taken from the input -- 
      current: 1, // current page number
      pageSize: 10, // 10 records each page
      maxPages: 0, //max number of pages for pagination
      filtered: false // to display message if filtered and no records available
    }
  },

  //pagination for the array
  computed: {
    indexStart() {
      return (this.current - 1) * this.pageSize;
    },
    indexEnd() {
      return this.indexStart + this.pageSize;
    },
    paginated() {
      return this.filteredCustomersArray.slice(this.indexStart, this.indexEnd);
    }
  },

  methods: {

    //sort tabe by fiven column name
    sortTable(col) {
      if (!["Hits", "Rank"].includes(col)) return; // only allow the function to be called if the Hits or Rank columns are clicked

      if (this.sortColumn === col) { //if clicked on the column, it will sort in asc order, if clicked another time it will sorted in desc order, and so on...
        this.ascending = !this.ascending;
      } else {
        this.ascending = true;
        this.sortColumn = col;
      }

      var ascending = this.ascending;

      this.filteredCustomersArray.sort(function (a, b) {
        let val1 = a[col] || 99999; //if the value is epty set it to hight value so it can be under the numbers
        let val2 = b[col] || 99999;

        if (parseFloat(val1) > parseFloat(val2)) {
          return ascending ? 1 : -1
        } else if (parseFloat(val1) < parseFloat(val2)) {
          return ascending ? -1 : 1
        }
        return 0;
      })
    },

    // select what column to filter with max and min values
    // changing the filter column name will reset the array sorting
    setFilterColumn(row) {
      this.filteredCustomersArray = this.mainCustomersArray;
      this.filterColumn = row.target.value;
      this.sortColumn = '';
    },

    // set min value and filter regarding the max and min values
    setminFilterValue(value) {
      this.minFilterValue = parseFloat(value.target.value);
      this.filterCustomers();
    },

    // set min value and filter regarding the max and min values
    setmaxFilterValue(value) {
      this.maxFilterValue = parseFloat(value.target.value);
      this.filterCustomers();
    },


    // filter the customer regarding the fiven max and min values
    filterCustomers() {

      this.filtered = true;

      // if there is no max value provided or it's 0, display only the filtering depending on the min value
      if (this.maxFilterValue == 0 || !this.maxFilterValue) {
        this.filteredCustomersArray = this.mainCustomersArray.filter((customer) => {
          let value = parseFloat(customer[this.filterColumn]) || 0;
          return value >= this.minFilterValue
        })
      }

      else {
        this.filteredCustomersArray = this.mainCustomersArray.filter((customer) => {
          let value = parseFloat(customer[this.filterColumn]) || 0;
          return value <= this.maxFilterValue && value >= this.minFilterValue
        })
      }

      // get max number of pages from the filtered array for pagination calculation
      this.maxPages = Math.ceil(this.filteredCustomersArray.length / 10);
      this.current = 1;

      // display no records message depending on this logic
      if (this.filteredCustomersArray.length == 0) {
        this.noCustomers = true;
        this.maxPages = 0;
      } else {
        this.noCustomers = false
      }
    },

    // decrease pagination current page
    prev() {
      this.current--;
    },

    // increase pagination current pag
    next() {
      this.current++
    }

  },

  // fires when the component mounts in the DOM
  mounted() {

    // fetch data from the api and save it to the array as json value
    fetch('https://api.sampleapis.com/baseball/hitsSingleSeason')
      .then((res) => res.json())
      .then((data) => {
        this.mainCustomersArray = this.filteredCustomersArray = data;
        this.maxPages = Math.ceil(data.length / 10); // get max number of pages (if the array length is 51 for example, the max num of pages is 6 (50 = 5 and +1 -- 10 each page))
      })
      .catch((err) => { //catch http request error
        console.log(err.message);
        this.noCustomers = true;
      })

  }
}
</script>

<style scoped>
.arrow_down {
  background-image: url('https://cdns.iconmonstr.com/wp-content/releases/preview/7.2.0/240/iconmonstr-arrow-down-alt-filled.png')
}

.arrow_up {
  background-image: url('https://cdns.iconmonstr.com/wp-content/releases/preview/7.2.0/240/iconmonstr-arrow-up-alt-filled.png')
}

.arrow {
  float: right;
  width: 12px;
  height: 15px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position-y: bottom;
}

.customers-table thead tr th,
.customers-table tbody tr td {
  width: 10%;
}

.customers-table thead tr th:last-child,
.customers-table tbody tr td:last-child {
  width: 15%;
}

.customers-table thead tr th:nth-child(2),
.customers-table tbody tr td:nth-child(2) {
  width: 45%;
}


.customers-table thead tr th {
  cursor: pointer;
}

.customers-table h3 {
  display: table-caption;
  max-width: 90vw;
  margin: 3rem auto 2rem;
}

.form-filter .row .field {
  display: flex;
  align-items: center;
  column-gap: 1rem;
  width: fit-content;
}

.form-filter {
  padding-left: 3rem;
  margin-bottom: 2rem;
  margin-top: 3rem;
}

label {
  word-break: keep-all;
  white-space: nowrap;
  font-weight: 600;
}

.field .form-control {
  width: 5rem;
}


.pagination {
  column-gap: 1rem;
}

.pagination .btn {
  --bs-btn-border-color: #0d6efd;
}

@media screen and (max-width:580px) {
  .form-filter .row {
    flex-direction: column;
    width: 15rem;
    row-gap: 1rem;
  }

  .form-filter .row .field {
    justify-content: space-between;
    width: 100%;
  }
}
</style>
