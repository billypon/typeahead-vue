<template lang="pug">
.v-typeahead.form-control.dropdown(:class="{open: active, focus: focus, disabled: disabled}" @click="toggleDropdown" @mousedown.prevent="")
  .v-typeahead-indicator.caret
  .v-typeahead-holder(:class="{highlight: !focus && !isValueEmpty}" v-show="!focus || !model") {{ isValueEmpty ? placeholder : !multiple && value ? getOptionLabel(value) : '' }}
  .v-typeahead-tag(v-if="multiple" v-for="option in value")
    span.v-typeahead-tag-remove(@click="toggleOption(option)" no-toggle) &times;
    | {{ getOptionLabel(option) }}
  .v-typeahead-input(contenteditable
    @input="model = $event.target.textContent"
    @focus="focus = true"
    @blur="focus = active = false; clearInput()"
    @keydown.up.prevent="onInputUp"
    @keydown.down.prevent="onInputDown"
    @keydown.enter.prevent="onInputEnter"
    @keyup.esc="onInputEsc"
    @keyup.delete="onInputDelete"
    @keyup="onInputKeyUp"
    @paste.prevent="onInputPaste"
    ref="input"
  )
  ul.v-typeahead-dropdown.dropdown-menu(:style="{'max-height': limit > 0 ? limit * 24 + 'px' : 'none'}" ref="list")
    li(v-for="(option, index) in filteredOptions", :class="{active: isOptionSelected(option), hover: index === current}" @click="toggleOption(option)" @mouseover="current = index" no-toggle) {{ getOptionLabel(option) }}
    li.no-option(v-if="!filteredOptions.length")
      slot(name="no-options") no matching options
</template>

<script>
import typeahead from '../typeahead'

export default typeahead
</script>
