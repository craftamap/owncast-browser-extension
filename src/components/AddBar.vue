<template>
  <div
    id="add-bar"
    class="add-bar"
  >
    <input
      id="add-url"
      v-model="url"
      type="url"
      class="add-url"
      @keyup.enter="submit"
    >
    <div class="icons">
      <AddIcon
        v-if="displayButton"
        @click="submit"
      />
      <LoadingIcon 
        v-if="displayLoading"
      />
      <ErrorIcon
        v-if="displayError"
      />
      <SuccessIcon 
        v-if="displaySuccess"
      />
    </div>
  </div>
</template>

<script>
import LoadingIcon from './icons/LoadingIcon.vue';
import SuccessIcon from './icons/SuccessIcon.vue';
import ErrorIcon from './icons/ErrorIcon.vue';
import AddIcon from './icons/AddIcon.vue';

export default {
	name: 'AddBar',
	components: {
		LoadingIcon,
		ErrorIcon,
		SuccessIcon,
		AddIcon,
	},
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
		}
	}
};
</script>

<style lang="scss">
@import "../scss/mixins.scss";
@import "../scss/colors.scss";

.add-bar {
  @include shadow;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  margin-top: 0.5rem;
  border-radius: 0.25rem;
  align-items: center;

  .dark & {
   background-color: $gray-800; 
  }
}

.icons {
  margin: 0.5rem 0 0.5rem 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

input.add-url {
  display: block;
  min-width: 0;
  flex-grow: 1;
  color: black;
}
</style>
