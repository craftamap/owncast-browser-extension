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
        @click="refresh"
      />
    </div>
    <div id="right">
      <AddIcon
        class="add-icon-big" 
        @click="toggleShowAddBar"
      />
    </div>
  </div>
</template>

<script>
import AddIcon from './icons/AddIcon.vue';
import RefreshIcon from './icons/RefreshIcon.vue';

export default {
	name: 'IconBar',
	components: {
		AddIcon,
		RefreshIcon
	},
	computed: {
		isLoading() {
			return this.$store.state.loading
		}
	},
	methods: {
		refresh(event) {
			this.$store.dispatch('updateInstanceData');
		},
		toggleShowAddBar(event) {
			this.$store.commit('toggleShowAddBar'); 
		}
	}
}
</script>


<style lang="scss">
@import "../scss/mixins.scss";
@import "../scss/colors.scss";

.logo-big {
  width: 1.5rem;
  height: 1.5rem;
  background-size: contain;
  background-image: url('../resources/icon-96.png');
}

.icon-bar {
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

</style>
