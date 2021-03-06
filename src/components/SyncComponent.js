'use strict';

import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NotificationSync from 'material-ui/svg-icons/notification/sync';
import NotificationSyncDisabled from 'material-ui/svg-icons/notification/sync-disabled';
import NotificationSyncProblem from 'material-ui/svg-icons/notification/sync-problem';
import Dialog from 'material-ui/Dialog';
import Formsy from 'formsy-react';
import { FormsyText, FormsySelect, FormsyToggle } from 'formsy-material-ui/lib';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import editSettings from '../actions/editSettings';
import * as SyncStates from '../constants/SyncStates.js'

require('styles//Sync.scss');

const messages = defineMessages({
  title: {
    id: 'sync.title',
    defaultMessage: 'Remote database sync settings'
  },
  reboothint: {
    id: 'sync.message.reboothint',
    defaultMessage: 'Sync settings have been changed and thus junkan needs to reboot now!'
  },
  buttonupdate: {
    id: 'sync.buttons.update',
    defaultMessage: 'Update'
  },
  buttonclose: {
    id: 'sync.buttons.close',
    defaultMessage: 'Close'
  },
  labeldburl: {
    id: 'sync.form.labels.dburl',
    defaultMessage: 'Url of a pouch db compatible remote database'
  },
  labeldbuser: {
    id: 'sync.form.labels.dbuser',
    defaultMessage: 'Remote database user'
  },
  labeldbpassword: {
    id: 'sync.form.labels.dbpassword',
    defaultMessage: 'Remote database password'
  },
  errordburl: {
    id: 'sync.form.validationerrors.dburl',
    defaultMessage: 'Please enter a valid url!'
  },
  labelsyncmode: {
    id: 'sync.form.labels.snycmode',
    defaultMessage: 'Sync mode'
  },
  syncmodeoptionread: {
    id: 'sync.form.options.read',
    defaultMessage: 'read'
  },
  syncmodeoptionwrite: {
    id: 'sync.form.options.write',
    defaultMessage: 'write'
  },
  syncmodeoptionreadwrite: {
    id: 'sync.form.options.readwrite',
    defaultMessage: 'read & write'
  },
  labelactive: {
    id: 'sync.form.labels.enable',
    defaultMessage: 'Enable sync'
  }
});

class SyncComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openForm: false,
      openRebootHint: false,
      submitButtonDisabled: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.settings.settingsHash !== nextProps.settings.settingsHash) {
      // Sync settings have been changed and thus junkan needs to reboot in order to have the changes taking place
      this.rebootWithNewDbSyncSettings();
    }
  }

  rebootWithNewDbSyncSettings = () => {
    this.setState({openForm: false});
    this.setState({openRebootHint: true})
  }

  openDialogForm = () => {
    this.setState({openForm: true})
  }

  closeDialogForm = () => {
    this.setState({openForm: false})
  }

  openDialogRebootHint = () => {
    this.setState({openRebootHint: true})
  }

  enableSubmitButton = () => {
    this.setState({submitButtonDisabled: false});
  }

  disableSubmitButton = () => {
    this.setState({submitButtonDisabled: true});
  }

  saveSettings = (data) => {
    const nextSettings = {
      remoteDbUrl: data.remoteDb,
      remoteDbUser: data.remoteDbUser,
      remoteDbPassword: data.remoteDbPassword,
      syncMode: data.syncMode,
      enabled: data.enabled
    };

    this.props.dispatch(editSettings(nextSettings));
  }

  reboot = () => {
    location.reload();
  }

  renderSVGForSyncState() {
    if (this.props.syncState.status === SyncStates.NOT_CONNECTED) {
      return <NotificationSyncDisabled />
    }
    if (this.props.syncState.status === SyncStates.UNKNOWN_ERROR ||
        this.props.syncState.status === SyncStates.LOGIN_FAILED ) {
      return <NotificationSyncProblem />
    }

    return <NotificationSync />
  }

  render() {
    const {formatMessage} = this.props.intl;

    const styles = {
      block: {
        maxWidth: 250
      },
      toggle: {
        marginBottom: 16
      }
    };

    return (
      <div className='fab sync-component'>
        <FloatingActionButton
          secondary={true}
          mini={true}
          onTouchTap={this.openDialogForm}
        >
          {this.renderSVGForSyncState()}
        </FloatingActionButton>

        <Snackbar
          open={this.state.openRebootHint}
          message={formatMessage(messages.reboothint)}
          autoHideDuration={this.props.snackbarDuration}
          onRequestClose={this.reboot}
        />

        <Dialog
          title={formatMessage(messages.title)}
          open={this.state.openForm}
          onRequestClose={this.closeDialogForm}
        >
          <Formsy.Form
            onValid={this.enableSubmitButton}
            onInvalid={this.disableSubmitButton}
            onValidSubmit={this.saveSettings}
          >
            <FormsyText
              name='remoteDb'
              validations='isUrl'
              validationError={formatMessage(messages.errordburl)}
              hintText='http://mypouchdb.com:5984/remote-slides'
              floatingLabelText={formatMessage(messages.labeldburl)}
              fullWidth={true}
              value={this.props.settings.remoteDbUrl}
            />
            <br />
            <FormsyText
              name='remoteDbUser'
              hintText='couch-user'
              floatingLabelText={formatMessage(messages.labeldbuser)}
              value={this.props.settings.remoteDbUser}
            />
            <br />
            <FormsyText
              type='password'
              name='remoteDbPassword'
              hintText='couch-password'
              floatingLabelText={formatMessage(messages.labeldbpassword)}
              value={this.props.settings.remoteDbPassword}
            />
            <br />
            <FormsySelect
              name='syncMode'
              value={this.props.settings.syncMode}
              floatingLabelText={formatMessage(messages.labelsyncmode)}
            >
              <MenuItem
                value={1}
                /* @TODO: https://github.com/callemall/material-ui/issues/4008 */
                style={{'WebkitAppearance': 'none'}}
                primaryText={formatMessage(messages.syncmodeoptionread)} />
              <MenuItem
                value={2}
                /* @TODO: https://github.com/callemall/material-ui/issues/4008 */
                style={{'WebkitAppearance': 'none'}}
                primaryText={formatMessage(messages.syncmodeoptionwrite)} />
              <MenuItem
                value={3}
                /* @TODO: https://github.com/callemall/material-ui/issues/4008 */
                style={{'WebkitAppearance': 'none'}}
                primaryText={formatMessage(messages.syncmodeoptionreadwrite)} />
            </FormsySelect>
            <br />
            <br />
            <div style={styles.block}>
              <FormsyToggle
                name='enabled'
                label={formatMessage(messages.labelactive)}
                style={styles.toggle}
                defaultToggled={this.props.settings.enabled}
              />
            </div>
            <div className='form-actions-container'>
              <FlatButton
                label={formatMessage(messages.buttonclose)}
                secondary={true}
                type='cancel'
                onTouchTap={this.closeDialogForm}
              />
              <FlatButton
                label={formatMessage(messages.buttonupdate)}
                primary={true}
                type='submit'
                disabled={this.state.submitButtonDisabled}
              />
            </div>
          </Formsy.Form>
        </Dialog>
      </div>
    );
  }
}

SyncComponent.displayName = 'SyncComponent';
SyncComponent.defaultProps = {
  snackbarDuration: 5000
};

function mapStateToProps(state) {
  return {
    settings: state.settings,
    syncState: state.syncState
  };
}

export default injectIntl(connect(mapStateToProps)(SyncComponent));
