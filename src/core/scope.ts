import { KNode } from './node';

/**
 * 作用域
 */
class KScope {
  public name: string = '';
  public variables = new Map<string, Object>(); // 变量

  private nodes = new Map<string, KNode>(); // 节点

  public addNode(name: string): KNode {
    const node = this.nodes.get(name);
    if (node === undefined || node == null) {
      const new_node = new KNode();
      new_node.name = this.name + '.@' + name;
      new_node.scope = this;
      this.nodes.set(name, new_node);
      return new_node;
    } else {
      return node;
    }
  }

  public removeNode(name: string): boolean {
    const node = this.nodes.get(name);
    if (node === undefined || node == null) return false;
    node.destory();
    return this.nodes.delete(name);
  }

  public destory() {
    this.nodes.forEach((node) => {
      node.destory();
    });
    this.nodes.clear();
    this.variables.clear();
  }
}

export { KScope };
