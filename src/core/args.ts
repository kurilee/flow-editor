import { KNode } from './node';
import { createArgConnect, deleteArgConnect } from './utils';

enum KArgState {
  Ready,
  Changed,
}

/**
 * 参数
 */
class KArg {
  public name: string = ''; // 名称
  public node: KNode | null = null; // 节点
  public type: string | null = null; // 类型
  public value: Object | null = null; // 值
}

/**
 * 输入参数
 */
class KArgInput extends KArg {
  public connection: KArgConnect | null = null;

  public connectFrom(from: KArgOutput): KArgConnect | null {
    if (from == null) return null;

    var connectionName = from.name + ' -> ' + this.name;
    if (from.connections.has(connectionName)) {
      const connect = from.connections.get(connectionName);
      if (connect == undefined) return null;
      return connect;
    } else {
      this.disconnect();
      return createArgConnect(from, this);
    }
  }

  public disconnect() {
    if (this.connection != null) deleteArgConnect(this.connection);
    this.connection = null;
  }
}

/**
 * 输出参数
 */
class KArgOutput extends KArg {
  public connections = new Map<string, KArgConnect>();

  public connectTo(to: KArgInput | null): KArgConnect | null {
    if (to == null) return null;

    var connectionName = this.name + ' -> ' + to.name;
    if (this.connections.has(connectionName)) {
      const connect = this.connections.get(connectionName);
      if (connect == undefined) return null;
      return connect;
    } else {
      this.disconnectTo(to);
      return createArgConnect(this, to);
    }
  }

  public disconnectTo(to: KArgInput) {
    if (to != null) {
      to.value = null;
      to.disconnect();
    }
  }

  public disconnect() {
    this.connections.forEach((connection) => {
      deleteArgConnect(connection);
    });
    this.connections.clear();
  }
}

/**
 * 参数连接
 */
class KArgConnect {
  public name: string = ''; // 名称
  public from: KArgOutput | null = null; // 来自
  public to: KArgInput | null = null; // 去往

  public invoke(): KArgState {
    let from_arg_state = KArgState.Ready;
    if (this.from != null && this.from.node != null) {
      from_arg_state = this.from.node.invoke();
    }
    if (this.to != null) {
      this.to.value = this.from == null ? null : this.from.value;
    }
    return from_arg_state;
  }
}

export { KArg, KArgInput, KArgOutput, KArgConnect, KArgState };
