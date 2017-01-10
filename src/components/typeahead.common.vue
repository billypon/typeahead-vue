<template lang="pug">
.v-typeahead.form-control.dropdown(:class="{open: active, focus: focus, disabled: disabled}" @click="toggleDropdown")
  .v-typeahead-indicator.caret
  .v-typeahead-text(v-if="!multiple && value") {{ getOptionLabel(value) }}
  .v-typeahead-tag(v-if="multiple" v-for="option in value")
    span.v-typeahead-tag-remove(@click="toggleOption(option)") &times;
    | {{ getOptionLabel(option) }}
  input.v-typeahead-input(ref="input"
    v-model="model"
    ,:placeholder="isValueEmpty ? placeholder : ''"
    @focus="focus = true"
    @blur="active = false; focus = false"
    @keyup.up="inputKeyUp"
    @keyup.down="inputKeyDown"
    @keyup.enter="inputKeyEnter"
    @keyup.esc="inputKeyEsc"
    @keyup.delete="inputKeyDelete")
  ul.v-typeahead-dropdown.dropdown-menu(:style="{'max-height': limit > 0 ? limit * 24 + 'px' : 'none'}" ref="list")
    li(v-for="(option, index) in filteredOptions", :class="{active: isOptionSelected(option), hover: index === current}" @mousedown.prevent="toggleOption(option)" @mouseover="current = index") {{ getOptionLabel(option) }}
    li.no-option(v-if="!filteredOptions.length")
      slot(name="no-options") no matching options
  iframe.v-typeahead-tester(ref="tester")
</template>

<script>
import typeahead from '../typeahead'

export default typeahead
</script>
