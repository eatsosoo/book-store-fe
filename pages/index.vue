<template>
  <div class="HomePage">
    <div>
      <v-img src="@/assets/img/banner.jpeg"></v-img>
    </div>

    <v-container>
      <div class="d-flex">
        <v-row class="mt-10 mb-10">
          <v-col lg="3" md="6" sm="6" class="d-flex align-center mt-10 mb-10">
            <div class="Badge"><v-icon>mdi-moped</v-icon></div>
            <div>
              <p class="Title">Vận chuyển nhanh</p>
              <p class="Content">
                Giao hàng nhanh chóng đến tận nhà bạn chỉ trong 10 ngày nhanh chóng!
              </p>
            </div>
          </v-col>
          <v-col lg="3" md="6" sm="6" class="d-flex align-center mt-10 mb-10">
            <div class="Badge"><v-icon>mdi-credit-card-marker</v-icon></div>
            <div>
              <p class="Title">Thanh toán an toàn</p>
              <p class="Content">
                Tự tin mua sắm với phương thức thanh toán an toàn của chúng tôi để bạn không phải lo lắng khi giao dịch.
              </p>
            </div>
          </v-col><v-col lg="3" md="6" sm="6" class="d-flex align-center mt-10 mb-10">
            <div class="Badge"><v-icon>mdi-shield-star</v-icon></div>
            <div>
              <p class="Title">Chất lượng tốt nhất</p>
              <p class="Content">
                Sự xuất sắc vượt trội, mang đến hình ảnh thu nhỏ của sản phẩm chất lượng cao cấp.
              </p>
            </div>
          </v-col><v-col lg="3" md="6" sm="6" class="d-flex align-center mt-10 mb-10">
            <div class="Badge"><v-icon>mdi-hand-heart</v-icon></div>
            <div class="Wrap">
              <p class="Title">Đảm bảo hoàn trả</p>
              <p class="Content">
                10 ngày đổi trả thoải mái. Đảm bảo hoàn lại tiền 100%.
              </p>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-container>

    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex align-center">
          <h1 class="flex-shrink-0 mr-5">Danh mục sản phẩm</h1>
          <hr class="w-100" />
        </v-col>
      </v-row>
      <v-row>
        <v-col lg="2" md="4" sm="4" v-for="category in categoryList" :key="category.id">
          <div class="relative d-flex align-center flex-column">
            <div class="CategoryCircle"></div>
            <div class="mb-5 d-flex justify-center align-center flex-column"
              @click="$router.push(`/category/${category.id}`)">
              <v-img :src="category.image_url" class="CategoryImg mb-10"></v-img>
              <p class="text-subtitle-2 font-weight-bold">
                {{ category.name }}
              </p>
            </div>
          </div>
        </v-col>
      </v-row>
      <div class="SpaceEmpty"></div>
    </v-container>

    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex align-center">
          <h1 class="flex-shrink-0 mr-5">Sách nổi bật</h1>
          <hr class="w-100" />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center" lg="2" md="4" sm="4" v-for="featuredBook in featuredBooks"
          :key="featuredBook.id">
          <NuxtLink :to="`/book/${featuredBook.id}`" class="Link">
            <div class="FeatureItem Bounce">
              <img :src="featuredBook.book_cover_url" class="FeatureImg" />
              <div>
                <p class="Author TextWithEllipsis">{{ featuredBook.author }}</p>
                <p class="Title TextWithEllipsis">{{ featuredBook.name }}</p>
                <p class="Price">{{ formatCurrency(featuredBook.price) }} đ</p>
              </div>
            </div>
          </NuxtLink>
        </v-col>
      </v-row>
      <div class="SpaceEmpty"></div>
    </v-container>

    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex align-center">
          <h1 class="flex-shrink-0 mr-5">Sách bán chạy nhất</h1>
          <hr class="w-100" />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center" lg="2" md="4" sm="4" v-for="bestSeller in bestSellers"
          :key="bestSeller.id">
          <NuxtLink :to="`/book/${bestSeller.id}`" class="Link">
            <div class="FeatureItem Bounce">
              <img :src="bestSeller.book_cover_url" class="FeatureImg" />
              <div>
                <p class="Author TextWithEllipsis">{{ bestSeller.author }}</p>
                <p class="Title TextWithEllipsis">{{ bestSeller.name }}</p>
                <p class="Price">{{ formatCurrency(bestSeller.price) }} đ</p>
              </div>
            </div>
          </NuxtLink>
        </v-col>
      </v-row>
      <div class="SpaceEmpty"></div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { logout } from "@/utils/utils";
import { useApi, type ResponseResultType } from "~/composable/useApiFetch";

definePageMeta({
  layout: "client",
});

type CategoryType = {
  id: number;
  name: string;
  image_url: string;
};

type BookType = {
  id: number;
  name: string;
  price: number;
  book_cover_url: string;
  author: string;
};

const categoryList = ref<CategoryType[]>([]);

const featuredBooks = ref<BookType[]>([]);

const bestSellers = ref<BookType[]>([]);

const loadItems = async () => {
  const { api } = useApi(undefined, "GET", null, undefined);
  const { data: resCategory } = await api<ResponseResultType>("/categories");
  const paging = "pagination=" + JSON.stringify({ page: 1, per_page: 6 });
  const { data: booksCategory } = await api<ResponseResultType>(
    "/books?" + paging
  );

  if (resCategory.value) {
    const { categories } = resCategory.value.data;
    categoryList.value = categories;
  }

  if (booksCategory.value) {
    const { books } = booksCategory.value.data;
    featuredBooks.value = books;
  }
};

const loadTopBooks = async () => {
  const { api } = useApi(undefined, "GET", null, undefined);
  const { data: topBooks } = await api<ResponseResultType>(
    "/books/top_books"
  );

  if (topBooks.value) {
    const { top_books } = topBooks.value.data;
    bestSellers.value = top_books;
  }
};

loadItems();
loadTopBooks();
</script>

<style scoped lang="scss">
.HomePage {
  background-color: #f5f5f5;
}

.Badge {
  height: 80px;
  width: 89px;
  border: 1px solid #a287d7;
  border-radius: 8px;
  color: #a287d7;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  margin-right: 10px;
  flex-shrink: 0;
}

.Wrap {
  flex: 1;
}

.Title {
  font-size: 18px;
  font-weight: bold;
}

.Content {
  font-size: 14px;
  color: #a79e9e;
}

.CategoryImg {
  height: 100px;
  width: 70px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.CategoryCircle {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  border: 2px solid #a287d7;
  position: absolute;
  margin-top: 30px;
}

.FeatureItem {
  height: 290px;
  width: 160px;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 12px 12px 15px;
  border: 1px solid #a287d7;
  background: rgb(255, 255, 255);
  background: linear-gradient(0deg,
      rgba(255, 255, 255, 1) 17%,
      rgba(162, 135, 215, 0.5333333333333333) 100%);
  animation-duration: 1s;
  animation-iteration-count: infinite;
  transform-origin: bottom;

  .Title {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 180px;
  }

  .Author {
    font-size: 12px;
  }

  .Price {
    font-size: 14px;
    font-weight: bold;
    color: #a287d7;
  }
}

.Bounce:hover {
  animation-name: Bounce;
  animation-timing-function: ease;
  cursor: pointer;
}

@keyframes Bounce {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-30px);
  }

  100% {
    transform: translateY(0);
  }
}

.FeatureImg {
  height: 200px;
  width: 135px;
  border-radius: 10px;
}

.SpaceEmpty {
  height: 100px;
}

.Link {
  text-decoration: none;
  color: inherit;

  i {
    color: #a287d7;
  }
}

.TextWithEllipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
