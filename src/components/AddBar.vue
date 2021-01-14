<template>
  <div
    id="add-bar"
    class="flex justify-between p-4 rounded shadow-md w-95% items-center"
  >
    <input
      id="add-url"
      v-model="url"
      type="url"
      class="form-input block min-w-0 flex-grow w-95%"
      @keyup.enter="submit"
    >
    <div class="my-2 ml-2 max-w-4 truncate">
      <svg
        v-if="displayButton"
        id="add-button"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-4 h-4 flex-shrink-0"
        @click="submit"
      >
        <path
          fill-rule="evenodd"
          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        v-if="displayLoading"
        id="spinner"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-4 h-4 animate-spin"
      >
        <path
          fill-rule="evenodd"
          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        v-if="displayError"
        id="error"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-4 h-4 text-red-500"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        v-if="displaySuccess"
        id="success"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-4 h-4 text-green-500"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
	name: 'AddBar',
	computed: {
		displayButton() {
			const loading = this.$store.state.add.loading;
			const error = this.$store.state.add.error;
			const success = this.$store.state.add.success;
			return !(loading || error || success);
		},
		displayLoading() {
			return this.$store.state.add.loading;
		},
		displayError() {
			return this.$store.state.add.error;
		},
		displaySuccess() {
			return this.$store.state.add.success;
		},
	},
	methods: {
		submit() {
			console.log(this.url);
			this.$store.dispatch('checkConnectionAndAddInStorage', this.url);
		},
	},
};
</script>
