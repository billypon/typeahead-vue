<template lang="pug">
#app
  div
    h1 single test:
    v-typeahead(v-model="value", :options="options")
    div {{ value }}

  div
    h1 multiple test:
    v-typeahead(v-model="values", :options="options" multiple)
    div {{ values }}
</template>

<script>
export default {
  data: function () {
    return {
      value: null,
      values: [],
      options: [
        { label: 'Bill Gates', value: 1 },
        { label: 'Jobs Steve', value: 2 },
        { label: 'Tim Cook', value: 3 },
        { label: 'Mark Elliot Zuckerberg', value: 4 },
        { label: 'Lawrence Edward Page', value: 5 }
      ]
    }
  }
}
</script>
