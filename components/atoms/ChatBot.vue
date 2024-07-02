<template>
  <div class="ChatBot">
    <img v-if="!open" src="@/assets/img/messenger.png" class="IconBar wobble" @click="open = true"/>
    <v-card v-else>
      <div class="pa-3">
        <v-icon>mdi-chat</v-icon> Chat với chúng tôi
        <v-icon class="FloatRight" @click="open = false">mdi-close</v-icon>
      </div>
      <div class="ListChat">
        <div
          v-for="(chat, index) in chats"
          :key="index"
          class="Message"
          :class="{ Bg: !chat.isBot }"
        >
          {{ chat.text }}
        </div>
      </div>
      <div class="d-flex align-center">
        <v-textarea
          v-model="message"
          class="pa-3"
          rows="1"
          variant="outlined"
          no-resize
          color="primary"
          hide-details
          placeholder="Nhập tin nhắn"
        ></v-textarea>
        <v-btn
          color="primary"
          icon="mdi-send"
          density="compact"
          class="mr-2"
          @click="sendMessage"
        ></v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const chats = ref([{ text: "Xin chào", isBot: true }]);
const message = ref("");
const open = ref(false);

const sendMessage = () => {
  chats.value.push({ text: message.value, isBot: false });
  message.value = "";
};
</script>

<style scoped lang="scss">
.ChatBot {
  position: fixed;
  bottom: 20px;
  right: 10px;
}

.ListChat {
  height: 300px;
  background-color: #a287d787;
  margin: 0 10px 0;
  overflow-y: auto;
}

.Message {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 70%;
  word-wrap: break-word;
}

.Bg {
  background-color: #a287d7;
}

.FloatRight {
  float: right;
  cursor: pointer;
}

.IconBar {
  cursor: pointer;
}

@keyframes wobble {
  0% { transform: rotate(0deg); }
  15% { transform: rotate(15deg); }
  30% { transform: rotate(-10deg); }
  45% { transform: rotate(10deg); }
  60% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
  90% { transform: rotate(-10deg); }
  100% { transform: rotate(0deg); }
}

.wobble {
  animation: wobble infinite 1s;
}
</style>
