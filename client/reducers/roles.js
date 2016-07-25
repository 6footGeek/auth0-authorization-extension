import { fromJS } from 'immutable';
import _ from 'lodash';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: []
};

export const roles = createReducer(fromJS(initialState), {
  [constants.FETCH_PERMISSIONS_PENDING]: (state) =>
    state.merge({
      ...initialState,
      loading: true
    }),
  [constants.FETCH_PERMISSIONS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the roles: ${action.errorMessage}`
    }),
  [constants.FETCH_PERMISSIONS_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      records: fromJS(_.sortBy(action.payload.data, role => role.id))
    }),

  [constants.SAVE_PERMISSION_FULFILLED]: (state, action) => {
    let records = state.get('records');
    const record = fromJS(action.payload.data);
    const index = records.findIndex((role) => role.get('_id') === action.meta.roleId);
    if (index >= 0) {
      records = records.splice(index, 1, record);
    } else {
      records = records.unshift(record);
    }

    return state.merge({
      records
    });
  },

  [constants.DELETE_PERMISSION_FULFILLED]: (state, action) => {
    const records = state.get('records');
    const index = records.findIndex((role) => role.get('_id') === action.meta.roleId);
    return state.merge({
      loading: false,
      records: records.delete(index)
    });
  }
});
