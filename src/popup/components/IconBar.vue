<template>
  <div
    id="icons"
    class="icon-bar"
  >
    <div id="left">
      <a
        href="https://directory.owncast.online"
        target="_blank"
      >
        <div
          class="logo-big"
        />
      </a>
    </div>
    <div id="center">
      <RefreshIcon
        class="icon icon-big icon-pointer"
        :is-loading="isLoading"
        @click="refresh"
      />
    </div>
    <div id="right">
      <PlusIcon
        class="icon icon-big"
        @click="toggleShowAddBar"
      />
      <CogWheelIcon
        class="icon icon-big"
        @click="openSettingsPage"
      />
    </div>
  </div>
</template>

<script>
import { PlusIcon, CogIcon } from '@heroicons/vue/solid'
import RefreshIcon from './icons/RefreshIcon.vue'
import browser from 'webextension-polyfill'
import { useStore } from '../store'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'IconBar',
	components: {
		PlusIcon,
		RefreshIcon,
		CogWheelIcon: CogIcon,
	},
	setup () {
		const store = useStore()

		return {
			isLoading: computed(() => store.loading),
			refresh: () => {
				store.updateInstanceData()
			},
			toggleShowAddBar: () => {
				store.toggleShowAddBar()
			},
			openSettingsPage: () => {
				browser.runtime.openOptionsPage()
			},
		}
	},
})
</script>

<style lang="scss">
@import "../../scss/mixins.scss";
@import "../../scss/colors.scss";

.logo-big {
  width: 1.5rem;
  height: 1.5rem;
  background-size: contain;
  background-image: url('../../resources/icon-96.png');
}

.icon-bar {
  @include shadow;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: space-between;
  justify-items: center;
  padding: 1rem;
  margin-top: 0.5rem;
  border-radius: 0.25rem;
  align-items: center;

  #left, #center, #right {
	line-height: 0;
  }

  div#left {
    justify-self: start;
  }

  div#right {
    justify-self: end;
  }

	.layout-compact & {
		padding: 0.25rem 0.5rem;
	}

  .dark & {
   background-color: $gray-800;
  }
}

</style>
