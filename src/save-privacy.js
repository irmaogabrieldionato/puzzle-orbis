import {deleteSingle,deleteMulti} from './multi-store.js';
import {languageTag} from './i18n.js';

export const SINGLE_KEY='puzzle-orbis-save';
const rows={
 'pt-BR':'Apagar partida salva|Apagar a partida e as fotos salvas neste navegador? Os recordes serão mantidos.|Partida salva apagada.|Não foi possível confirmar a exclusão da partida.',
 en:'Delete saved game|Delete the saved game and its photos from this browser? Records will be kept.|Saved game deleted.|Could not confirm that the saved game was deleted.',
 zh:'删除存档|删除此浏览器中的存档及照片？纪录会保留。|存档已删除。|无法确认存档已删除。',
 hi:'सहेजा हुआ खेल हटाएँ|इस ब्राउज़र से सहेजा खेल और तस्वीरें हटाएँ? रिकॉर्ड बने रहेंगे।|सहेजा खेल हट गया।|खेल हटने की पुष्टि नहीं हुई।',
 es:'Borrar partida guardada|¿Borrar la partida y sus fotos de este navegador? Se conservarán los récords.|Partida guardada borrada.|No se pudo confirmar el borrado.',
 fr:'Supprimer la partie enregistrée|Supprimer la partie et ses photos de ce navigateur ? Les records seront conservés.|Partie enregistrée supprimée.|Impossible de confirmer la suppression.',
 ar:'حذف اللعبة المحفوظة|هل تريد حذف اللعبة وصورها من هذا المتصفح؟ ستبقى الأرقام القياسية.|حُذفت اللعبة المحفوظة.|تعذّر تأكيد الحذف.',
 bn:'সংরক্ষিত খেলা মুছুন|এই ব্রাউজার থেকে সংরক্ষিত খেলা ও ছবি মুছবেন? রেকর্ড থাকবে।|সংরক্ষিত খেলা মুছে গেছে।|মুছে ফেলা নিশ্চিত করা যায়নি।',
 ru:'Удалить сохранённую игру|Удалить сохранённую игру и её фото из этого браузера? Рекорды сохранятся.|Сохранённая игра удалена.|Не удалось подтвердить удаление.',
 id:'Hapus permainan tersimpan|Hapus permainan tersimpan dan fotonya dari peramban ini? Rekor tetap disimpan.|Permainan tersimpan dihapus.|Penghapusan tidak dapat dikonfirmasi.',
 ur:'محفوظ کھیل حذف کریں|اس براؤزر سے محفوظ کھیل اور اس کی تصاویر حذف کریں؟ ریکارڈ برقرار رہیں گے۔|محفوظ کھیل حذف ہوگیا۔|حذف ہونے کی تصدیق نہیں ہوسکی۔',
 de:'Spielstand löschen|Spielstand und Fotos aus diesem Browser löschen? Rekorde bleiben erhalten.|Spielstand gelöscht.|Löschen konnte nicht bestätigt werden.',
 ja:'セーブデータを削除|このブラウザーからセーブデータと写真を削除しますか？記録は残ります。|セーブデータを削除しました。|削除を確認できませんでした。',
 sw:'Futa mchezo uliohifadhiwa|Ufute mchezo na picha zake kwenye kivinjari hiki? Rekodi zitabaki.|Mchezo uliohifadhiwa umefutwa.|Haikuwezekana kuthibitisha ufutaji.',
 mr:'जतन केलेला खेळ हटवा|या ब्राउझरमधून जतन केलेला खेळ आणि फोटो हटवायचे? विक्रम कायम राहतील.|जतन केलेला खेळ हटवला.|खेळ हटवल्याची खात्री करता आली नाही.',
};
export function privacyCopy(index){
 const [label,confirm,deleted,failed]=(rows[languageTag(index)]??rows['pt-BR']).split('|');
 return {label,confirm,deleted,failed};
}
export async function removeSingleSnapshot(storage, removeDatabase=typeof indexedDB==='undefined'?null:deleteSingle){
 // Attempt both copies even when one store fails. Only report success when both confirm.
 const legacy=async()=>{
  storage.removeItem(SINGLE_KEY);
  if(storage.getItem(SINGLE_KEY)!==null)throw Error('Legacy save still present');
 };
 const actions=[legacy()];
 if(removeDatabase)actions.push(Promise.resolve().then(removeDatabase));
 const result=await Promise.allSettled(actions);
 if(result.some(x=>x.status==='rejected'))throw Error('Could not confirm deletion from every store');
}
export function bindSaveDeletion({button,locale,busy,onConfirmed,erase,report}){
 button.onclick=async()=>{
  if(button.disabled||busy()||!window.confirm(privacyCopy(locale()).confirm))return;
  button.disabled=true;
  try{onConfirmed?.();await erase();report(privacyCopy(locale()).deleted);}
  catch{report(privacyCopy(locale()).failed);}
  finally{button.disabled=false;}
 };
}
export {deleteMulti};
