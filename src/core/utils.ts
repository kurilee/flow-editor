import { KNode } from './node';
import { KArgInput, KArgOutput, KArgConnect, KArgState } from './args';

function createArgConnect(
  output: KArgOutput | null,
  input: KArgInput | null
): KArgConnect | null {
  if (output == null || input == null) return null;
  const connect = new KArgConnect();
  connect.from = output;
  connect.to = input;
  connect.name = output.name + ' -> ' + input.name;
  output.connections.set(connect.name, connect);
  input.connection = connect;
  return connect;
}

function createNodeArgConnect(
  fromNode: KNode | null,
  fromOnputName: string,
  toNode: KNode | null,
  toInputName: string
): KArgConnect | null {
  if (fromNode == null || toNode == null) return null;
  const arg_output: KArgOutput | null = fromNode.getArgOutput(fromOnputName);
  const arg_input: KArgInput | null = toNode.getArgInput(toInputName);
  return createArgConnect(arg_output, arg_input);
}

function deleteArgConnect(connect: KArgConnect | null) {
  if (connect == null) return;

  if (connect.to != null) {
    if (connect.to.node !== null) connect.to.node.arg_state = KArgState.Changed;
    connect.to.connection = null;
  }
  if (connect.from != null) connect.from.connections.delete(connect.name);

  connect.from = null;
  connect.to = null;
  connect.name = '';
}

export { createArgConnect, createNodeArgConnect, deleteArgConnect };
