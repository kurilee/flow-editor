import { KScope } from './scope';
import { KArgInput, KArgOutput, KArgState } from './args';
import { deleteArgConnect } from './utils';

/**
 * 逻辑节点
 */
class KNode {
  public name: string = ''; // 节点名称
  public scope: KScope | null = null; // 作用域

  private variables = new Map<string, Object>(); // 变量
  private inputs = new Map<string, KArgInput>(); // 输入
  private outputs = new Map<string, KArgOutput>(); // 输出
  public action: Function | null = null;

  public arg_state: KArgState = KArgState.Changed; // 节点状态

  public invoke(): KArgState {
    this.inputs.forEach((v: KArgInput) => {
      if (v.connection != null) {
        const prev_node_state = v.connection.invoke();
        if (prev_node_state == KArgState.Changed) {
          this.arg_state = KArgState.Changed;
        }
      }
    });

    if (this.arg_state == KArgState.Changed) {
      if (this.action != null) this.action(this);
      this.arg_state = KArgState.Ready;
      return KArgState.Changed;
    } else {
      return KArgState.Ready;
    }
  }

  public addArgInput(
    name: string,
    type: string | null = null,
    value: Object | null = null
  ): KArgInput | null {
    const arg_input = this.inputs.get(name);
    if (arg_input === undefined || arg_input == null) {
      const new_arg_input = new KArgInput();
      new_arg_input.name = this.name + '.&' + name;
      new_arg_input.node = this;
      new_arg_input.type = type;
      new_arg_input.value = value;
      this.inputs.set(name, new_arg_input);
      this.arg_state = KArgState.Changed;
      return new_arg_input;
    } else {
      if (arg_input.value !== value) {
        arg_input.value = value;
        this.arg_state = KArgState.Changed;
      }
      return arg_input;
    }
  }
  public getArgInput(name: string): KArgInput | null {
    const arg_input = this.inputs.get(name);
    if (arg_input === undefined) return null;
    return arg_input;
  }
  public removeArgInput(name: string): boolean {
    const arg_input = this.inputs.get(name);
    if (arg_input === undefined || arg_input == null) return false;
    arg_input.disconnect();
    this.inputs.delete(name);
    this.arg_state = KArgState.Changed;
    return true;
  }
  public setInputVal(name: string, value: Object | null): boolean {
    const arg_input = this.inputs.get(name);
    if (arg_input === undefined || arg_input == null) return false;
    if (arg_input.connection !== null) deleteArgConnect(arg_input.connection);
    arg_input.value = value;
    this.arg_state = KArgState.Changed;
    return true;
  }
  public getInputVal(key: string): Object | null {
    var arg_input = this.inputs.get(key);
    if (arg_input === undefined || arg_input == null) return null;
    return arg_input.value;
  }

  public addArgOutput(
    name: string,
    type: string | null = null
  ): KArgOutput | null {
    const arg_output = this.outputs.get(name);
    if (arg_output === undefined || arg_output == null) {
      const new_arg_output = new KArgOutput();
      new_arg_output.name = this.name + '.$' + name;
      new_arg_output.node = this;
      new_arg_output.type = type;
      this.outputs.set(name, new_arg_output);
      return new_arg_output;
    } else {
      return arg_output;
    }
  }
  public getArgOutput(name: string): KArgOutput | null {
    const output = this.outputs.get(name);
    if (output === undefined) return null;
    return output;
  }
  public removeOutput(name: string): boolean {
    const arg_output = this.outputs.get(name);
    if (arg_output === undefined || arg_output == null) return false;
    arg_output.disconnect();
    this.outputs.delete(name);
    return true;
  }
  public setOutputVal(key: string, value: Object | null): boolean {
    const arg_output = this.outputs.get(key);
    if (arg_output === undefined || arg_output == null) return false;
    arg_output.value = value;
    return true;
  }
  public getOutputVal(key: string): Object | null {
    var arg_output = this.outputs.get(key);
    if (arg_output === undefined || arg_output == null) return null;
    return arg_output.value;
  }

  public destory() {
    this.inputs.forEach((arg_input) => {
      arg_input.disconnect();
    });
    this.outputs.forEach((arg_output) => {
      arg_output.disconnect();
    });
    this.variables.clear();
    this.inputs.clear();
    this.outputs.clear();
    this.scope = null;
    this.action = null;
  }
}

/**
 * 条件节点
 */
class KConditionNode {}

export { KNode };
