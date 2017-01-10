function getPropertyValueSum (dom, ...props) {
  let computedStyle = window.getComputedStyle(dom)
  let sum = 0
  for (let prop of props) {
    sum += parseInt(computedStyle.getPropertyValue(prop))
  }
  return sum
}

export default {
  props: {
    /*
    * Contains the currently selected value. Very similar to a
    * `value` attribute on an <input>. In most cases, you'll want
    * to set this as a two-way binding, using :value.sync. However,
    * this will not work with Vuex, in which case you'll need to use
    * the change callback property.
    */
    value: {
      default: null
    },

    /*
    * An array of strings or objects to be used as dropdown choices.
    * If you are using an array of objects, vue-typeahead will look for
    * a `label` key (ex. [{label: 'This is Foo', value: 'foo'}]). A
    * custom label key can be set with the `label` prop.
    */
    options: {
      type: Array,
      default () {
        return []
      }
    },

    /*
    * Equivalent to the `multiple` attribute on a `<select>` input.
    */
    multiple: Boolean,

    /*
    * Equivalent to the `placeholder` attribute on an `<input>`.
    */
    placeholder: {
      type: String,
      default: ''
    },

    /*
    * Tells vue-typeahead what key to use when generating option
    * labels when each `option` is an object.
    */
    label: {
      type: String,
      default: 'label'
    },

    /*
    * Tells vue-typeahead how many dropdown items to show.
    */
    limit: {
      type: Number,
      default: 10
    },

    /*
    * An optional callback function that is called when filtering options.
    * @param option
    * @return {Boolean}
    */
    filter: Function,

    /*
    * Callback to generate the label text. If {option}
    * is an object, returns option[this.label] by default.
    * @param option
    * @return {String}
    */
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
      oldModel: ''
    }
  },

  methods: {
    /**
    * Toggle the visibility of the dropdown menu.
    */
    toggleDropdown (event) {
      let target = event.target
      let tag = target.tagName.toLowerCase()
      if (tag === 'li') {
        return
      }
      this.current = -1
      this.$refs.list.scrollTop = 0
      this.active = !this.active
      this.$refs.input.focus()
    },

    /**
    * Toggle a given option.
    */
    toggleOption (option, focus) {
      this.model = ''
      let value = this.value
      if (!this.multiple) {
        value = option
        !focus ? this.$refs.input.blur() : 0
      } else {
        let index = value.indexOf(option)
        index === -1 ? value.push(option) : value.splice(index, 1)
      }
      this.applyValue(value)
    },

    /*
    * Check if the given option is currently selected.
    *
    * @param  option
    * @return {Boolean}
    */
    isOptionSelected (option) {
      return !this.multiple ? this.value === option : this.value.indexOf(option) !== -1
    },

    inputKeyUp (event) {
      if (!this.active) return

      this.current = (this.current > 0 ? this.current : this.filteredOptions.length) - 1
      this.setListFocus()

      !this.active ? this.toggleDropdown(event) : 0
    },

    inputKeyDown (event) {
      if (!this.active) return

      this.current = (this.current + 1 < this.filteredOptions.length ? this.current : -1) + 1
      this.setListFocus()

      !this.active ? this.toggleDropdown(event) : 0
    },

    inputKeyEnter (event) {
      if (!this.active) return

      let index = this.current
      if (index === -1) {
        if (!this.filteredOptions.length) return
        index = 0
      }
      this.toggleOption(this.filteredOptions[index], true)
      !this.multiple ? this.toggleDropdown(event) : 0
    },

    inputKeyEsc () {
      this.active ? this.active = false : this.model = ''
    },

    inputKeyDelete (event) {
      if (event.keyCode !== 8) return

      let active = true

      if (!this.model) {
        active = false
        if (!this.oldModel) {
          let value = this.value
          !this.multiple ? value = null : value.pop()
          this.applyValue(value)
        }
      }

      this.oldModel = this.model
      active && !this.active ? this.toggleDropdown(event) : 0
    },

    setInputWidth () {
      this.$refs.input.style.width = this.$el.clientWidth - getPropertyValueSum(this.$el, 'padding-right') - this.$refs.input.offsetLeft - 1 + 'px' // -1用于修正text小数宽度
    },

    setListFocus () {
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
    /*
    * Check if there aren't any options selected.
    *
    * @return {Boolean}
    */
    isValueEmpty () {
      return !this.multiple ? !this.value : !this.value || !this.value.length
    },

    /*
    * The currently displayed options, filtered
    * by the search elements value.
    *
    * @return {array}
    */
    filteredOptions () {
      let model = this.model
      let filter = this.filter ? this.filter : option => option[this.label].indexOf(model) !== -1
      return this.options.filter(function (option) {
        return filter(option, model)
      })
    }
  },

  mounted () {
    let timeout
    let width
    this.$refs.tester.contentWindow.addEventListener('resize', () => {
      // event will be fired immediatly
      if (width === this.$refs.tester.clientWidth) return
      width = this.$refs.tester.clientWidth
      clearTimeout(timeout)
      this.$refs.input.style.width = ''
      timeout = setTimeout(() => {
        this.setInputWidth()
      }, 100)
    })
  },

  updated () {
    this.setInputWidth()
  },

  watch: {
    value () {
      this.$refs.input.style.width = '' // reset to minimum width
    }
  }
}

