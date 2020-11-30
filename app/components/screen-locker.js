import React from 'react';
import {connect} from 'react-redux';

import {AsyncStorage, View, StyleSheet} from 'react-native';
import PinLoginView from './pin-login-view';
import Actions from '../actions/auth';
import HaydiGoLogo from './haydigo-logo';

export let lockScreen = {
  locker: () => {
  }
};

class ScreenLocker extends React.Component {
  state = {
    locked: false
  };

  constructor(props, context) {
    super(props, context);
    this.lock = this.lock.bind(this);
    lockScreen.locker = this.lock;
  }

  componentWillReceiveProps(nextProps): void {
    if (nextProps.screenLocked && !this.state.locked) {
      this.setState({
        locked: nextProps.screenLocked,
      });
    }
  }

  lock = () => {
    if (!this.state.locked) {
      AsyncStorage.getItem('accessToken', null).then(accessToken => {
        if (accessToken) {
          Actions.lockScreen().then((res) => {
            this.setState({locked: res.result.screenLocked});
          });
        }
      });
    }
  };

  unlock = () => {
    this.setState({locked: false});
  };

  render() {
    const {locked} = this.state;

    return (
      <View style={StyleSheet.absoluteFill}>
        {this.props.children}
        {locked ? (
          <View
            style={[styles.wrapper]}>
            <View style={[styles.haydiGoWrapper]}>
              <HaydiGoLogo size={'md'} style={[styles.haydiGoLogo]}/>
            </View>
            <PinLoginView styles={[styles.pin]} onLoggedIn={this.unlock}/>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#333',
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  pin: {
    flex: 1
  },
  haydiGoWrapper: {flex: .6, justifyContent: 'center', alignItems: 'center'},
  haydiGoLogo: {position: 'relative'},
});

const mapStateToProps = store => {
  const {home} = store.common;
  let screenLocked = false;
  if (home && home.user) {
    screenLocked = home.user.screenLocked;
  }
  return {home, screenLocked};
};

export default connect(mapStateToProps)(ScreenLocker);
