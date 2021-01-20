<template>
  <div
    id="instance"
    class="flex flex-col p-4 rounded shadow-md w-95%"
    :data-instance="instance.instance"
  >
    <div class="flex flex-row items-center">
      <a
        :href="instance.instance"
        target="_blank"
      >
        <div
          class="rounded h-24 w-32 bg-cover bg-center mr-4 flex-shrink-0"
          :style="backgroundSrc"
        />
      </a>
      <div class="flex flex-col flex-grow text-base">
        <div class="mb-2">
          <a
            :href="instance.instance"
            target="_blank"
          ><span class="font-bold">{{ instance.name }}</span> is
            <span
              :class="[instance.online ? 'text-green-600' : 'text-gray-500' ]"
            >{{ instance.status }}</span></a>
        </div>
        <div class="text-sm mb-2">
          {{ instance.description }}
        </div>
        <div class="flex justify-between items-center">
          <div id="left">
            <div
              v-if="instance.online"
              class="inline-block"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-4 h-4 inline-block"
              >
                <path
                  d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
                />
              </svg>
              {{ instance.viewer }}
            </div>
            <div
              v-if="instance.online"
              class="inline-block"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-4 h-4 inline-block"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ instance.onlineSince.hour }}h {{ instance.onlineSince.minute }}m 
            </div>
          </div>
          <div id="right">
            <div class="inline-block">
              <svg
                id="show-remove"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-4 h-4 cursor-pointer"
                @click="toggleRemove"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showRemove"
      id="delete-section"
      class="my-2"
    >
      <button
        id="remove"
        class="bg-red-500 px-4 py-2 text-white rounded"
        @click="remove"
      >
        remove
      </button>
    </div>
  </div>
</template>

<script>
export default {
	name: 'Instance',
	props: {
		instance: {
			type: Object,
			default: () => {return {}}
		}
	},
	data() {
		return {
			showRemove: false,
		}
	},
	computed: {
		backgroundSrc() {
			return {
				'background-image': 'url('+(this.instance.online ? this.instance.thumbnail : this.instance.logo) +')',
			}
		}
	}, 
	methods: {
		toggleRemove() {
			this.showRemove = !this.showRemove;
		},
		remove() {
			const instanceUrl = this.instance.instance;
			console.log('clicked remove on', instanceUrl);
			this.$store.dispatch('removeInstanceInStorage', instanceUrl);
		}
	}
}
</script>
