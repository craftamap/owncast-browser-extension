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
        class="icon"
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
import LoadingIcon from '../../shared/components/icons/LoadingIcon.vue'
import SuccessIcon from '../../shared/components/icons/SuccessIcon.vue'
import ErrorIcon from '../../shared/components/icons/ErrorIcon.vue'
import { PlusIcon } from '@heroicons/vue/solid'
import { useStore } from '../store'
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'AddBar',
	components: {
		LoadingIcon,
		ErrorIcon,
		SuccessIcon,
		AddIcon: PlusIcon,
	},
	setup () {
		const store = useStore()
		const url = ref('')

		return {
			url,
			submit: () => {
				console.log(url.value)
				store.checkConnectionAndAddInStorage(url.value)
			},
			displayButton: computed(() => {
				const loading = store.add.loading
				const error = store.add.error
				const success = store.add.success
				return !(loading || error || success)
			}),
			displayLoading: computed(() => {
				return store.add.loading
			}),
			displayError: computed(() => {
				return store.add.error
			}),
			displaySuccess: computed(() => {
				return store.add.success
			}),
		}
	},
})
</script>

<style lang="scss">
@import "../../scss/mixins.scss";
@import "../../scss/colors.scss";

.add-bar {
  @include shadow;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  margin-top: 0.5rem;
  border-radius: 0.25rem;
  align-items: center;

	.layout-compact & {
    margin-top: 0.125rem;
		padding: 0.25rem 0.5rem;
	}

  .dark & {
   background-color: $gray-800;
  }
}

.icons {
  margin: 0.5rem 0 0.5rem 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 0;
}

input.add-url {
  display: block;
  min-width: 0;
  flex-grow: 1;
  color: black;
}
</style>
