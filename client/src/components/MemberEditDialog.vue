<template>
  <v-dialog v-model="dialogWindow" max-width="800px">
    <v-card>
      <v-card-title primary-title>
        <span class="title">Edit Member</span>
        <v-spacer />
        <v-btn flat icon color="grey">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form ref="form" v-model="formValid">
          <v-container grid-list-xl>
            <v-layout wrap justify-space-between>
              <v-flex xs12 md6>
                <v-text-field v-model="name" :rules="nameRules" label="Name" required></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field v-model="phone" mask="phone" label="Phone"></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-card flat>
                  <v-layout justify-center>
                    <span class="subheading">Notifications</span>
                  </v-layout>
                  <v-layout row wrap justify-center>
                    <v-flex xs6>
                      <v-checkbox
                        class="pa-0 ma-0"
                        color="primary"
                        v-model="smsNotifications"
                        label="sms"
                      ></v-checkbox>
                    </v-flex>
                    <v-flex xs6>
                      <v-checkbox
                        class="pa-0 ma-0"
                        color="primary"
                        v-model="emailNotifications"
                        label="email"
                      ></v-checkbox>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>
            </v-layout>
            <v-layout row wrap align-center justify-space-around>
              <v-flex xs12 sm5>
                <v-menu v-model="pickStartDateMenu" transition="scale-transition" lazy>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :value="newStartDate | formatDate"
                      label="Start Date"
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-date-picker v-model="newStartDate" no-title scrollable></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex v-if="$vuetify.breakpoint.smAndUp" sm2 pl-3>
                <v-icon large color="primary">arrow_right_alt</v-icon>
              </v-flex>
              <v-flex xs12 sm5 pr-0>
                <v-text-field :value="endDate | formatDate" label="End Date" readonly disabled />
              </v-flex>
            </v-layout>
            <v-layout justify-center>
              <v-btn class="mr-5" color="error">Cancel</v-btn>
              <v-btn color="primary" @click="upsertMember">Submit</v-btn>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import moment from 'moment';
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';

export default {
  data: () => ({
    formValid: false,
    name: '',
    email: '',
    phone: '',
    smsNotifications: false,
    emailNotifications: false,
    pickStartDateMenu: false,
    newStartDate: moment().format('YYYY-MM-DD'),
    memberTermCurrent: false,
    nameRules: [v => !!v || 'Name is required'],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ]
  }),

  computed: {
    ...mapState('editMemberDialog', { dialogVisable: 'visable' }),
    ...mapGetters('members', { currentMemeber: 'current' }),
    endDate() {
      return moment(this.newStartDate)
        .add(1, 'year')
        .format('YYYY-MM-DD');
    },
    dialogWindow: {
      get() {
        return this.dialogVisable;
      },
      set() {
        this.hideDialog();
      }
    }
  },

  watch: {
    currentMemeber: function(member) {
      this.initializeDialog(member);
    }
  },

  methods: {
    ...mapActions('editMemberDialog', { hideDialog: 'hide' }),
    ...mapMutations('snackBar', { showSnackbar: 'show' }),
    ...mapActions('members', {
      createMember: 'create',
      updateMember: 'update'
    }),

    initializeDialog(member) {
      this.member = member;
      this.newStartDate = date => moment.utc().format('YYYY-MM-DD');
    },

    async upsertMember() {
      console.error('NOT IMPLEMENTED');
    }
  }
};
</script>

