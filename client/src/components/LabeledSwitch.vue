<template>
  <v-switch
    v-if="switchPredicate"
    :value="switchValue"
    :value-comparator="(switchValue) => !!switchValue"
    :color="color"
    light
    debounce="20"
    @change="switchAction()"
  >
    <template v-slot:prepend>
      <v-tooltip left>
        <v-icon slot="activator">{{ icon }}</v-icon>
        <span>{{ switchLabel }}</span>
      </v-tooltip>
    </template>
  </v-switch>
</template>

<script>
export default {
  name: 'LabeledSwitch',
  props: {
    switchPredicate: {
      type: Boolean,
      default: false
    },
    switchValue: {
      type: Boolean,
      default: false
    },
    switchAction: {
      type: Function,
      default: undefined
    },
    switchLabel: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'primary'
    },
    icon: {
      type: String,
      default: ''
    }
  }
};
</script>
