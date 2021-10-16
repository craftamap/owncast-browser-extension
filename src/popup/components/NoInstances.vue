<template>
  <div
    class="no-instances"
  >
    <p class="no-instances--header">
      No instances found yet!
    </p>
    <p class="no-instances--description">
      Add your first owncast-instance by clicking the "+"-icon above or visit an owncast instance and click the "Add to extension"-Button!
    </p>
  </div>
</template>

<style lang="scss">
.no-instances {
  margin: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  p {
    margin: 0.25rem;
  }

  .no-instances--description {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
}
</style>
