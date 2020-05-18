import { Component, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Events } from 'ionic-angular';
import { UtilityProvider } from '../../providers/utility/utility';
declare const CKEDITOR;

/**
 * Generated class for the CkeditorComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'editor-sdr',
  templateUrl: 'editor-sdr.html'
})
export class EditorSdrComponent {
  @ViewChild('editor') ckeditor: any;
  @Input('content') public content: string;
  @Output() public contentChanged: EventEmitter<string>;

  config: any = {
    defaultLanguage: 'zh-cn',
    language: 'en',
    allowedContent: true,
    scayt_autoStartup: false,
    removePlugins: 'elementspath,tableselection,magicline',
    extraPlugins: 'tableresize, font',
    enterMode: 3,
    fillEmptyBlocks: true,
    basicEntities: false,
    pasteFromWord_inlineImages: false,
    toolbar: [
      {
        name: 'clipboard',
        items: ['Undo', 'Redo']
      },
      {
        name: 'basicstyles',
        // 12-12-2019 -- Mayur Varshney -- remove Italics button
        items: ['Bold', 'Underline', 'FontSize']
      },
      {
        name: 'paragraph',
        items: ['NumberedList', 'BulletedList']
      },
      {
        name: 'insert',
        items: ['Table']
      }
    ],
    menu_groups: 'clipboard,form,tablerow,tablecolumn',
    // 12-12-2019 -- Mayur Varshney -- restrict Italics functionality by Ctrl + buttons
    keystrokes: [[CKEDITOR.CTRL + 73, null], [CKEDITOR.CTRL + 105, null]]
  };

  constructor(public utilityProvider: UtilityProvider, public event: Events) {
    this.contentChanged = new EventEmitter<string>();

    CKEDITOR.on('dialogDefinition', function (ev) {
      // Take the dialog name and its definition from the event data.
      var dialogName = ev.data.name;
      var dialogDefinition = ev.data.definition;

      if (dialogName == 'table' || dialogName == 'tableProperties') {
        dialogDefinition.removeContents('advanced');

        var infoTab = dialogDefinition.getContents('info');
        infoTab.remove('txtHeight');
        infoTab.remove('txtCellPad');
        infoTab.remove('txtCellSpace');
        infoTab.remove('selHeaders');
        infoTab.remove('txtSummary');
        infoTab.remove('txtCaption');
        infoTab.remove('cmbAlign');
        infoTab.remove('cmbAlign');

        infoTab.txtBorder = infoTab.get('txtBorder');
        infoTab.txtBorder['style'] = 'display:none; width:0;';

        infoTab.txtWidth = infoTab.get('txtWidth');
        infoTab.txtWidth['default'] = '100%';

        // dialogDefinition.onShow = function() {
        //   var select = this.getContentElement( 'info', 'txtBorder' );
        //   select.disable();                
        // }
      }
    });
  }

  onChange(e) {
    this.contentChanged.emit(e);
  }

  onReady(e) {
    let self = this;
    CKEDITOR.on('instanceReady', function () {
      setTimeout(() => {
        self.event.publish('load_detailedNotes', null);
        self.contentChanged.emit(e);
      }, 2000)

    });

  }

}
