<template>
  <div
    id="instance"
    class="instance"
    :data-instance="instance.instance"
  >
    <div class="instance-main">
      <a
        :href="instance.instance"
        target="_blank"
      >
        <div
          class="instance-image"
          :style="backgroundSrc"
        />
      </a>
      <div class="instance-text">
        <div class="instance-text-header">
          <a
            :href="instance.instance"
            target="_blank"
          ><span class="instance-text-bold">{{ instance.name }}</span> is
            <span
              :class="[instance.online ? 'instance-text-online' : 'instance-text-offline' ]"
            >{{ instance.status }}</span></a>
        </div>
        <div class="instance-text-stream-title">
          {{ instance.streamTitle }}
        </div>
        <div class="instance-text-description">
          {{ instanceDescription }}
        </div>
        <div class="instance-icon-bar">
          <div id="left">
            <div
              v-if="instance.online"
              class="instance-icon-bar-viewers"
              title="current number of viewers"
            >
              <UsersIcon class="icon" />
              {{ instance.viewer }}
            </div>
            <div
              v-if="instance.online"
              class="instance-icon-bar-uptime"
              title="uptime"
            >
              <ClockIcon class="icon" />
              {{ instance.onlineSince.hour }}h {{ instance.onlineSince.minute }}m
            </div>
          </div>
          <div id="right">
            <div class="instance-icon-bar-chevron">
              <ChevronIcon
                :orientation="showHidden ? 'up' : 'down'"
                @click="toggleHidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showHidden"
      class="instance-hidden-icon-bar"
    >
      <div class="instance-icon-bar-remove">
        <TrashIcon
          class="icon"
          @click="toggleRemove"
        />
      </div>
    </div>
    <div
      v-if="showRemove"
      class="delete-section"
    >
      <button
        id="remove"
        @click="remove"
      >
        remove
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import stripHtml from '../../shared/util/stripHtml'
import { UsersIcon, ClockIcon, TrashIcon } from '@heroicons/vue/solid'
import ChevronIcon from './icons/ChevronIcon.vue'
import { ref, toRefs, computed, defineComponent } from 'vue'
import { useStore } from '../store/'

export default defineComponent({
	name: 'InstanceItem',
	components: {
		UsersIcon,
		ClockIcon,
		TrashIcon,
		ChevronIcon,
	},
	props: {
		instance: {
			type: Object,
			default: () => { return {} },
		},
	},
	setup (props) {
		const store = useStore()
		const { instance } = toRefs(props)

		const showRemove = ref(false)
		const toggleRemove = () => {
			showRemove.value = !showRemove.value
		}
		const hideRemove = () => {
			showRemove.value = false
		}

		const showHidden = ref(false)
		const toggleHidden = () => {
			hideRemove()
			showHidden.value = !showHidden.value
		}

		const remove = () => {
			const instanceUrl = instance.value.instance
			console.log('clicked remove on', instanceUrl)
			store.removeInstanceInStorage(instanceUrl)
		}
		const instanceDescription = computed(() => {
			return stripHtml(instance.value.description)
		})

		const backgroundSrc = computed(() => {
			return {
				'background-image': 'url(' + (instance.value.online ? instance.value.thumbnail : instance.value.logo) + ')',
			}
		})

		return {
			showHidden,
			toggleHidden,
			showRemove,
			toggleRemove,
			remove,
			instanceDescription,
			backgroundSrc,
		}
	},
})
</script>

<style lang="scss">
@import "../../scss/mixins.scss";
@import "../../scss/colors.scss";

.instance {
  @include shadow;
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
  padding: 1rem;
  border-radius: 0.25rem;

  .layout-compact & {
    margin-top: 0.125rem;
    padding: 0.25rem 0.5rem;
  }

  .dark & {
    background-color: $gray-800;
  }

  .delete-section {
    margin-bottom: 0.5rem;

    button {
        background-color: $red-500;
        padding: 0.5rem 1rem;
        color: white;
        border-radius: 0.25rem;
    }
  }

  .instance-main {
  /* class="flex flex-row items-center" */
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .instance-image {
    border-radius: 0.25rem;
    width: 8rem;
    height: 6rem;
    background-size: cover;
    background-position: center;
    margin-right: 1rem;
    flex-shrink: 0;
    .layout-compact & {
      width: 6rem;
      height: 4rem;
    }
  }

  .instance-text {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .instance-text-bold {
      font-weight: 700;
    }

    .instance-text-online {
      color: $green-600;
    }

    .instance-text-offline {
      color: $gray-500;
    }

    .instance-text-stream-title {
	font-size: 0.875rem;
    }

    .instance-text-description {
      font-size: 0.75rem;
      line-height: 1.25rem;
      margin-bottom: 0.5rem;
    }
  }

  .instance-icon-bar, .instance-hidden-icon-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .instance-icon-bar-viewers, .instance-icon-bar-uptime, .instance-icon-bar-chevron, .instance-icon-bar-remove {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding-right: 0.5rem;
    }
  }
}

</style>
