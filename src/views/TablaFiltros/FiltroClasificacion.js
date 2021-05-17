import React, { Component } from 'react';
import DropDownBox from 'devextreme-react/drop-down-box';
import TreeView from 'devextreme-react/tree-view';
import { Button } from 'devextreme-react/button';

const datosOrigen = [
  {
    id: '-1',
    text: 'Todos',
  },
  {
    id: '7',
    text: 'Acería Celaya',
  },
  {
    id: '22',
    text: 'Acería Ramos Arizpe',
  },
  {
    id: '1',
    text: 'Acería Saltillo',
  },
];

class FiltroClasificacion extends Component {
  constructor(props) {
    super(props);

    this.treeView = null;
    this.state = {
      treeBoxValue: [],
      openDropdown: false,
      dataSource: datosOrigen,
    };
    this.treeView_itemSelectionChanged = this.treeView_itemSelectionChanged.bind(this);
    this.syncTreeViewSelection = this.syncTreeViewSelection.bind(this);
    this.treeViewRender = this.treeViewRender.bind(this);

    this.dropRef = React.createRef();
  }

  treeViewRender() {
    return (
      <div>
        <TreeView
          dataSource={this.state.dataSource}
          ref={(ref) => (this.treeView = ref)}
          height={250}
          selectAllText="Seleccionar todos"
          dataStructure="tree"
          keyExpr="id"
          selectionMode="multiple"
          showCheckBoxesMode="normal"
          expandedExpr="expanded"
          disabledExpr="disabled"
          scrollDirection="vertical"
          selectNodesRecursive
          noDataText="No hay datos"
          displayExpr="text"
          selectByClick
          onContentReady={this.syncTreeViewSelection}
          onItemSelectionChanged={this.treeView_itemSelectionChanged}
        />
        <div style={{ width: 110, float: 'right', margin: '15px' }}>
          <Button
            text="Aplicar"
            type="normal"
            width={120}
            onClick={() => {
              if (this.props.onSelectCallBack)
                this.props.onSelectCallBack(this.state.treeBoxValue.join(','));

              if (this.dropRef.current.instance)
                this.dropRef.current.instance.option('opened', false);
            }}
          />
        </div>
      </div>
    );
  }

  syncTreeViewSelection(e) {
    const treeView =
      (e.component.selectItem && e.component) || (this.treeView && this.treeView.instance);

    if (treeView) {
      if (e.value === null) {
        treeView.unselectAll();
        if (this.props.onSelectCallBack) this.props.onSelectCallBack(null);
        if (this.dropRef.current.instance) this.dropRef.current.instance.option('opened', false);
      } else {
        const values = e.value || this.state.treeBoxValue;
        values &&
          values.forEach((value) => {
            treeView.selectItem(value);
          });
      }
    }

    if (e.value !== undefined) {
      this.setState({
        treeBoxValue: e.value,
      });
    }
  }

  treeView_itemSelectionChanged(e) {
    this.setState({
      treeBoxValue: e.component.getSelectedNodeKeys(),
    });
  }

  componentDidMount() {}

  render() {
    return (
      <div style={{ marginLeft: '5px', marginRight: '5px' }}>
        <DropDownBox
          width={330}
          value={this.state.treeBoxValue}
          valueExpr="id"
          displayExpr="text"
          placeholder="Selecciona Origen"
          showClearButton
          dataSource={this.state.dataSource}
          onValueChanged={this.syncTreeViewSelection}
          contentRender={this.treeViewRender}
          ref={this.dropRef}
        />
      </div>
    );
  }
}

export default FiltroClasificacion;
