import {languageTag} from './i18n.js';

// Position of the cursor and position of the selected tile are independent.
// These messages describe controls, not the visual content of the photo.
const copy = {
 en:['Position {position} of {count}.','No piece selected.','Selected: position {slot}.','Selected: board {board}, position {slot}.'],
 zh:['位置 {position}，共 {count} 个。','未选择拼图块。','已选：位置 {slot}。','已选：拼图板 {board}，位置 {slot}。'],
 hi:['स्थान {position}, कुल {count}।','कोई टुकड़ा चुना नहीं गया है।','चुना गया स्थान: {slot}।','चुना गया: बोर्ड {board}, स्थान {slot}।'],
 es:['Posición {position} de {count}.','Ninguna pieza seleccionada.','Selección: posición {slot}.','Selección: tablero {board}, posición {slot}.'],
 fr:['Position {position} sur {count}.','Aucune pièce sélectionnée.','Sélection : position {slot}.','Sélection : plateau {board}, position {slot}.'],
 ar:['الموضع {position} من {count}.','لم تُحدَّد أي قطعة.','الموضع المحدد: {slot}.','التحديد: اللوحة {board}، الموضع {slot}.'],
 bn:['অবস্থান {position}, মোট {count}।','কোনো টুকরা নির্বাচন করা হয়নি।','নির্বাচিত অবস্থান: {slot}।','নির্বাচন: বোর্ড {board}, অবস্থান {slot}।'],
 ru:['Позиция {position} из {count}.','Фрагмент не выбран.','Выбрана позиция {slot}.','Выбрано: поле {board}, позиция {slot}.'],
 'pt-BR':['Posição {position} de {count}.','Nenhuma peça selecionada.','Seleção: posição {slot}.','Seleção: tabuleiro {board}, posição {slot}.'],
 id:['Posisi {position} dari {count}.','Tidak ada keping yang dipilih.','Dipilih: posisi {slot}.','Dipilih: papan {board}, posisi {slot}.'],
 ur:['جگہ {position}، کل {count}۔','کوئی ٹکڑا منتخب نہیں ہے۔','منتخب جگہ: {slot}۔','انتخاب: تختہ {board}، جگہ {slot}۔'],
 de:['Position {position} von {count}.','Kein Teil ausgewählt.','Auswahl: Position {slot}.','Auswahl: Spielfeld {board}, Position {slot}.'],
 ja:['全{count}か所中、位置{position}。','ピースは選択されていません。','選択中：位置{slot}。','選択中：ボード{board}、位置{slot}。'],
 sw:['Nafasi {position} kati ya {count}.','Hakuna kipande kilichochaguliwa.','Chaguo: nafasi {slot}.','Chaguo: ubao {board}, nafasi {slot}.'],
 mr:['जागा {position}, एकूण {count}।','कोणताही तुकडा निवडलेला नाही.','निवडलेली जागा: {slot}.','निवड: पट {board}, जागा {slot}.']
};
const numberFormats = new Map();
export function positionMessage(index, active, selected) {
 if(!active)return '';
 const tag=languageTag(index);
 if(!numberFormats.has(tag))numberFormats.set(tag,new Intl.NumberFormat(tag));
 const values={position:active.slot+1,count:active.count,slot:selected?.slot+1,board:selected?.board+1};
 const [cursor,none,one,multiple]=copy[tag];
 const message=cursor+' '+(!selected?none:selected.board===undefined?one:multiple);
 return message.replace(/\{(\w+)\}/g,(_,key)=>numberFormats.get(tag).format(values[key]));
}
export function updateFeedback(element,message) {
 if(element.textContent!==message)element.textContent=message;
}
