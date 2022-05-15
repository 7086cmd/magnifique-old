/** @format */
import { defineComponent, ref } from "vue";
import { getUpd } from "./fetch";
export default defineComponent(() => {
  const text = ref("");
  async function ft() {
    text.value = (await getUpd()).content;
    console.log(text.value);
  }
  const isDialogOpen = ref(true);
  ft();
  return (
    <el-dialog v-model={isDialogOpen}>
      <v-md-editor type='preview' v-model={text}></v-md-editor>
    </el-dialog>
  );
});
