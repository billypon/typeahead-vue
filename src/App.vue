<template lang="pug">
#app
  div
    h1 single test:
    v-typeahead(v-model="value", :options="options" optionGroup="group")
    div {{ value }}

  div
    h1 multiple test:
    v-typeahead.input-lg(v-model="values", :loadOptions="loadOptions" multiple)
    div {{ values }}
</template>

<script>
export default {
  data () {
    return {
      value: null,
      values: [],
      options: [
        { label: 'Bill Gates', value: 1, group: 'two words' },
        { label: 'Jobs Steve', value: 2, group: 'two words' },
        { label: 'Tim Cook', value: 3, group: 'two words' },
        { label: 'Mark Elliot Zuckerberg', value: 4 },
        { label: 'Lawrence Edward Page', value: 5 }
      ],
      loadOptions (search) {
        return new Promise((resolve, reject) => {
          setTimeout(() => { resolve([
            { label: 'Super Man', value: 1 },
            { label: 'Bat Man', value: 2 },
            { label: 'Spider Man', value: 3 },
          ]) }, 1000)
        })
      }
    }
  }
}
</script>
