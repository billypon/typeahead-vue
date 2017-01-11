export default {
  props: {
    //
    // Contains the currently selected value. Very similar to a
    // `value` attribute on an <input>. In most cases, you'll want
    // to set this as a two-way binding, using :value.sync. However,
    // this will not work with Vuex, in which case you'll need to use
    // the change callback property.
    //
    value: {
      default: null
    },

    //
    // An array of strings or objects to be used as dropdown choices.
    // If you are using an array of objects, vue-typeahead will look for
    // a `label` key (ex. [{label: 'This is Foo', value: 'foo'}]). A
    // custom label key can be set with the `label` prop.
    //
    options: {
      type: Array,
      default () {
        return []
      }
    },

    loadOptions: Function,

    //
    // Equivalent to the `multiple` attribute on a `<select>` input.
    //
    multiple: Boolean,

    //
    // Equivalent to the `disabled` attribute on a `<select>` input.
    //
    disabled: Boolean,

    //
    // Equivalent to the `placeholder` attribute on an `<input>`.
    //
    placeholder: {
      type: String,
      default: ''
    },

    //
    // If false, when press Enter, will select the first item of list automaticly.
    //
    disableEnter: Boolean,

    //
    // Tells vue-typeahead what key to use when generating option
    // labels when each `option` is an object.
    //
    label: {
      type: String,
      default: 'label'
    },

    //
    // Tells vue-typeahead how many dropdown items to show.
    //
    limit: {
      type: Number,
      default: 10
    },

    //
    // An optional callback function that is called when filtering options.
    // @param option
    //
    // @return {Boolean}
    //
    filter: Function,

    //
    // Callback to generate the label text. If {option}
    // is an object, returns option[this.label] by default.
    // @param option
    //
    // @return {String}
    //
    getOptionLabel: {
      type: Function,
      default (option) {
        return this.label && option[this.label] ? option[this.label] : option
      }
    }
  },

  data () {
    return {
      active: false,
      focus: false,
      model: '',
      current: -1,
      asyncOptions: null,
      loading: false,
      error: null
    }
  },

  methods: {
    //
    // Toggle the visibility of the dropdown menu.
    //
    toggleDropdown (event) {
      if (this.disabled || event.target.getAttribute('no-toggle')) {
        return
      }
      this.active = !this.active
      this.resetList()
      if (this.active) {
        this.$refs.input.focus()
        this.loadAsyncOptions(true)
      }
    },

    //
    // Toggle a given option.
    //
    toggleOption (option) {
      let value = this.value
      if (!this.multiple) {
        value = option
        this.$refs.input.blur()
      } else {
        let index = value.indexOf(option)
        index === -1 ? value.push(option) : value.splice(index, 1)
        this.clearInput()
      }
      this.applyValue(value)
    },

    async loadAsyncOptions (skip) {
      if (!this.loadOptions || skip && this.asyncOptions) return
      this.asyncOptions = null
      this.resetList()
      this.loading = true
      this.error = null
      try {
        this.asyncOptions = await this.loadOptions(this.model)
      } catch (err) {
        this.error = err
        console.error('[v-typeahead]', 'async options error', err)
      }
      this.loading = false
    },

    //
    // Check if the given option is currently selected.
    //
    // @param  option
    // @return {Boolean}
    //
    isOptionSelected (option) {
      return !this.multiple ? this.value === option : this.value.indexOf(option) !== -1
    },

    clearInput () {
      this.model = this.$refs.input.textContent = ''
    },

    resetList () {
      this.current = -1
      this.$refs.list.scrollTop = 0
    },

    onInputUp (event) {
      this.current = (this.current > 0 ? this.current : this.filteredOptions.length) - 1
      this.hoverListItem()
    },

    onInputDown (event) {
      this.current = (this.current + 1 < this.filteredOptions.length ? this.current : -1) + 1
      this.hoverListItem()
    },

    onInputEnter (event) {
      if (!this.active || this.disableEnter) return

      let index = this.current
      if (index === -1) {
        if (!this.filteredOptions.length) return
        index = 0
      }
      this.toggleOption(this.filteredOptions[index])
    },

    onInputEsc () {
      this.active ? this.active = false : this.clearInput()
    },

    onInputDelete (event) {
      if (!this.model && !this.oldModel && event.keyCode === 8) {
        let value = this.value
        !this.multiple ? value = null : value.pop()
        this.applyValue(value)
      }
      this.oldModel = this.model
    },

    onInputKeyUp (event) {
      switch (event.keyCode) {
        case 8: // backspace
        case 46: // delete
          if (this.model) break
        case 13: // enter
        case 27: // esc
          return
      }
      !this.active ? this.toggleDropdown(event) : 0
    },

    onInputPaste (event) {
      let data = (event.clipboardData || clipboardData).getData('text')
      if (!getSelection) {
        document.execCommand("insertText", false, data)
      } else {
        let range = getSelection().getRangeAt(0)
        let temp = document.createElement("span")
        temp.innerHTML = "&#FEFF;"
        range.deleteContents()
        range.insertNode(temp)
        let textRange = document.body.createTextRange()
        textRange.moveToElementText(temp)
        temp.parentNode.removeChild(temp)

        textRange.text = data
        textRange.collapse(false)
        textRange.select()
      }
    },

    hoverListItem () {
      if (!(this.limit > 0 && this.filteredOptions.length > this.limit)) return

      let unit = 24
      let list = this.$refs.list

      let scrollTop = this.current * unit
      list.scrollTop > scrollTop ? list.scrollTop = scrollTop : 0

      scrollTop = Math.max((this.current + 1 - this.limit) * unit, 0)
      list.scrollTop < scrollTop ? list.scrollTop = scrollTop : 0
    },

    applyValue (value) {
      this.$emit('input', value)
    }
  },

  computed: {
    //
    // Check if there aren't any options selected.
    //
    // @return {Boolean}
    //
    isValueEmpty () {
      return !this.multiple ? !this.value : !this.value || !this.value.length
    },

    //
    // The currently displayed options, filtered
    // by the search elements value.
    //
    // @return {array}
    //
    filteredOptions () {
      return this.asyncOptions || this.options.filter((option) => {
        return this.filter ? this.filter(option, this.model) : !this.model ? true : this.getOptionLabel(option).indexOf(this.model) !== -1
      })
    }
  }
}

