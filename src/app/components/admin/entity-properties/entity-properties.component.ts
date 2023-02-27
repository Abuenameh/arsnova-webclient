import { Component, Input, OnChanges } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

@Component({
  selector: 'app-entity-properties',
  templateUrl: './entity-properties.component.html',
  styleUrls: ['./entity-properties.component.scss'],
})
export class EntityPropertiesComponent implements OnChanges {
  @Input() entity: object;
  @Input() translateKeys = false;
  @Input() expandOnInit = false;
  treeControl: NestedTreeControl<any> = new NestedTreeControl(
    (obj) => obj.value
  );
  dataSource = new MatTreeNestedDataSource<object>();

  ngOnChanges() {
    this.dataSource.data = this.toNode(this.entity);
    if (this.expandOnInit) {
      this.treeControl.dataNodes = this.dataSource.data;
      this.treeControl.expandAll();
    }
  }

  toNode(object: object) {
    if (typeof object === 'object') {
      return object
        ? Object.entries(object).map((item) => {
            return { key: item[0], value: this.toNode(item[1]) };
          })
        : null;
    }

    return object;
  }

  hasChild(number: number, node: any) {
    return node.value && typeof node.value === 'object';
  }

  isSimpleValue(value: any) {
    return typeof value !== 'object';
  }
}
