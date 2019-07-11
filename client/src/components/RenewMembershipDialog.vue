<template>
  <v-dialog v-model="dialogWindow" max-width="450px">
    <v-card>
      <v-card-title primary-title>
        <span class="title">
          Renew Membership for
          <span class="primary--text">{{ member.name | capitalize}}</span>
        </span>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form ref="form" v-model="form">
          <template class="font-weight-medium">
            <span v-if="memberTermCurrent">
              Current term end:
              <span
                class="primary--text"
              >{{ member.term && member.term.end | formatDate }}</span>
            </span>
            <span class="red--text" v-else>Membership term is currently expired</span>
          </template>
          <v-container fluid px-0>
            <v-layout row wrap align-center justify-space-around>
              <v-flex xs12 sm5>
                <v-menu v-model="pickStartDateMenu" transition="scale-transition" lazy>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :value="newStartDate | formatDate"
                      label="New Start Date"
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-date-picker v-model="newStartDate" no-title scrollable :min="minStartDate"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex v-if="$vuetify.breakpoint.smAndUp" sm2 pl-3>
                <v-icon large color="primary">arrow_right_alt</v-icon>
              </v-flex>
              <v-flex xs12 sm5 pr-0>
                <v-text-field :value="endDate | formatDate" label="New End Date" readonly disabled />
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-center pb-4">
        <v-btn
          :disabled="!form"
          :loading="areMembersLoading"
          color="primary"
          outline
          @click="renew"
        >Renew Membership</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
import moment from 'moment';

export default {
  name: 'RenewMembershipDialog',
  data: () => ({
    form: false,
    pickStartDateMenu: 'false',
    newStartDate: moment().format('YYYY-MM-DD'),
    memberTermCurrent: false,
    minStartDate: null,
    rules: {
      required: v => !!v || 'This field is required'
    },
    member: {}
  }),
  methods: {
    ...mapMutations('snackBar', { showSnackbar: 'show' }),
    ...mapActions('members', ['renewMembership']),
    ...mapActions('renewMembershipDialog', { hideDialog: 'hide' }),

    async renew() {
      try {
        await this.renewMembership({
          memberId: this.currentMemeber.id,
          startDate: this.newStartDate
        });
        this.showSnackbar({
          text: 'Membership renewed! 🙌',
          color: 'primary'
        });
      } catch (err) {
        this.showSnackbar({
          text: `⚠️ Error(s): ${err.data.map((d, i) => `${i + 1} - ${d} `)}`,
          color: 'black',
          timeout: 10000
        });
      } finally {
        this.hideDialog();
      }
    },

    initializeDialog(member) {
      this.member = member;
      this.memberTermCurrent = member.isTermCurrent;

      const formatDate = date => moment.utc(date).format('YYYY-MM-DD');

      this.newStartDate = formatDate(
        member.isTermCurrent ? member.term.end : new Date()
      );
      this.minStartDate = member.isTermCurrent
        ? formatDate(member.term.end)
        : null;
    }
  },
  computed: {
    ...mapState('renewMembershipDialog', { dialogVisable: 'visable' }),
    ...mapState('members', { areMembersLoading: 'isCreatePending' }),
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
  }
};
</script>
