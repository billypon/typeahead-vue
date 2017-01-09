<template lang="pug">
.v-typeahead.form-control.dropdown(:class="{open: active, multiple: multiple}" @click="toggleDropdown")
  .v-typeahead-indicator.caret
  .v-typeahead-text(v-if="!multiple && value") {{ getOptionLabel(value) }}
  .v-typeahead-tag(v-if="multiple" v-for="option in value")
    span.v-typeahead-tag-remove(@click="toggleOption(option)") &times;
    | {{ getOptionLabel(option) }}
  input.v-typeahead-input(ref="input"
    v-model="model"
    ,:placeholder="isValueEmpty ? placeholder : ''"
    @blur="active = false"
    @keyup.up="inputKeyUp"
    @keyup.down="inputKeyDown"
    @keyup.enter="inputKeyEnter"
    @keyup.esc="inputKeyEsc"
    @keyup.delete="inputKeyDelete")
  ul.v-typeahead-dropdown.dropdown-menu(:style="{'max-height': maxItem > 0 ? maxItem * 24 + 'px' : 'none'}" ref="list")
    li(v-for="(option, index) in filteredOptions", :class="{active: isOptionSelected(option), hover: index === current}" @mousedown.prevent="toggleOption(option)" @mouseover="current = index") {{ getOptionLabel(option) }}
    li.no-option(v-if="!filteredOptions.length")
      slot(name="no-options") no matching options
</template>

<script>
import typeahead from '../typeahead'

export default typeahead
</script>
