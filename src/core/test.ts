// 测试
import { KScope, KNode, createNodeArgConnect } from './index';

function createAddNode(scope: KScope, name: string = 'add'): KNode | null {
  let node = scope.addNode(name);
  if (node != null) {
    node.addArgInput('input1');
    node.addArgInput('input2');
    node.addArgOutput('output1');
    node.action = (node: KNode) => {
      const inp1 = node.getInputVal('input1')! as number;
      const inp2 = node.getInputVal('input2')! as number;
      const result = inp1 + inp2;

      node.setOutputVal('output1', result);
    };
    return node;
  }
  return null;
}

function createMultipileNode(
  scope: KScope,
  name: string = 'mul'
): KNode | null {
  let node = scope.addNode(name);
  if (node != null) {
    node.addArgInput('input1');
    node.addArgInput('input2');
    node.addArgOutput('output1');
    node.action = (node: KNode) => {
      const inp1 = node.getInputVal('input1')! as number;
      const inp2 = node.getInputVal('input2')! as number;
      const result = inp1 * inp2;

      node.setOutputVal('output1', result);
    };
    return node;
  }
  return null;
}

// 单个节点执行逻辑
function test1() {
  let scope = new KScope();
  scope.name = 'scope1';

  let node = createAddNode(scope);
  node!.setInputVal('input1', 123);
  node!.setInputVal('input2', 456);
  node!.invoke();

  console.log(node!.getOutputVal('output1')!);
}
test1();

// 2个节点, 数据传输
function test2() {
  let scope = new KScope();
  scope.name = 'scope1';

  let addNode = createAddNode(scope);
  let mulNode = createMultipileNode(scope);

  addNode!.setInputVal('input1', 123);
  addNode!.setInputVal('input2', 456);

  createNodeArgConnect(addNode, 'output1', mulNode, 'input1');
  mulNode!.setInputVal('input2', 0.5);

  mulNode!.invoke();
  console.log(mulNode!.getOutputVal('output1')!);

  addNode!.destory();
  mulNode!.invoke();
  console.log(mulNode!.getOutputVal('output1')!);
}
test2();
