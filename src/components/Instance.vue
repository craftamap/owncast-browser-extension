<template>
  <div
    id="instance"
    class="flex flex-col p-4 rounded shadow-md w-95%"
    data-instance="instance"
  >
    <div class="flex flex-row">
      <div
        class="h-24 w-32 bg-cover bg-center mr-4 flex-shrink-0"
        style="background-image: url('replace')"
      />
      <div class="flex flex-col">
        <div>
          <a
            href="instance"
          ><span class="font-bold">name</span> is
            <span
              class="replace"
            >status</span></a>
        </div>
        <div class="text-sm">
          description
        </div>
        <div class="flex justify-between items-center">
          <div id="left">
            <div class="inline-block">
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
              viewer
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
      id="delete-section"
      class="my-2 hidden"
    >
      <button
        id="remove"
        class="bg-red-500 px-4 py-2 text-white rounded"
      >
        remove
      </button>
    </div>
  </div>
</template>

<script>
export default {
	name: 'Instance',
}
</script>
