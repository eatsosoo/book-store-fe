<template>
  <div class="HomePage">
    <div class="BorderBottom">
      <v-container>
        <div class="d-flex justify-space-between align-center mt-3 mb-3">
          <div>
            <p class="text-h4">Bookie</p>
            <p>Website for books</p>
          </div>
          <div class="Search">
            <v-text-field
              :loading="loading"
              append-inner-icon="mdi-magnify"
              density="compact"
              label="Search books"
              variant="solo"
              hide-details
              single-line
              rounded="pill"
              @click:append-inner="onClick"
            ></v-text-field>
          </div>
          <div v-if="!store.hasToken">
            <NuxtLink to="/login">
              <v-btn
                color="primary"
                @click="onClick"
                variant="outlined"
                rounded="pill"
                class="mr-4"
                >Log In</v-btn
              >
            </NuxtLink>
            <v-btn color="primary" rounded="pill" @click="onClick"
              >Sign Up</v-btn
            >
          </div>
          <div v-else>
            <v-btn density="default" icon="mdi-logout" color="primary" @click="logout"></v-btn>
          </div>
        </div>
      </v-container>
    </div>
    <div class="BorderBottom">
      <v-container>
        <div class="d-flex justify-center">
          <div class="Tab">home</div>
          <div class="Tab">authors</div>
        </div>
      </v-container>
    </div>

    <div>
      <v-img src="@/assets/img/image.png"></v-img>
    </div>

    <v-container>
      <div class="d-flex">
        <v-row class="mt-10 mb-10">
          <v-col lg="3" md="6" sm="6" class="d-flex align-center mt-10 mb-10">
            <div class="Badge"><v-icon>mdi-moped</v-icon></div>
            <div>
              <p class="Title">Quick Delivery</p>
              <p class="Content">
                Swift delivery to your doorstep in just 10 rapid days!
              </p>
            </div>
          </v-col>
          <v-col lg="3" md="6" sm="6" class="d-flex align-center mt-10 mb-10">
            <div class="Badge"><v-icon>mdi-credit-card-marker</v-icon></div>
            <div>
              <p class="Title">Secure Payment</p>
              <p class="Content">
                Shop confidently with out secure payment for worry-free
                transactions
              </p>
            </div> </v-col
          ><v-col lg="3" md="6" sm="6" class="d-flex align-center mt-10 mb-10">
            <div class="Badge"><v-icon>mdi-shield-star</v-icon></div>
            <div>
              <p class="Title">Best Quality</p>
              <p class="Content">
                Unsurpassed excellence, delivering the epitome of premium
                quality products
              </p>
            </div> </v-col
          ><v-col lg="3" md="6" sm="6" class="d-flex align-center mt-10 mb-10">
            <div class="Badge"><v-icon>mdi-hand-heart</v-icon></div>
            <div class="Wrap">
              <p class="Title">Return Guarantee</p>
              <p class="Content">
                Swift delivery to your doorstep in just 10 rapid days!
              </p>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-container>

    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex align-center">
          <h1 class="flex-shrink-0 mr-5">View All Categories</h1>
          <hr class="w-100" />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          lg="2"
          md="4"
          sm="4"
          v-for="category in categories"
          :key="category.title"
        >
          <div class="relative d-flex align-center flex-column">
            <div class="CategoryCircle"></div>
            <div class="mb-5 d-flex justify-center align-center flex-column">
              <v-img :src="category.url" class="CategoryImg mb-10"></v-img>
              <p class="text-subtitle-2 font-weight-bold">
                {{ category.title }}
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
          <h1 class="flex-shrink-0 mr-5">Featured Books</h1>
          <hr class="w-100" />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          class="d-flex justify-center"
          lg="2"
          md="4"
          sm="4"
          v-for="featuredBook in featuredBooks"
          :key="featuredBook.title"
        >
          <div class="FeatureItem">
            <img :src="featuredBook.url" class="FeatureImg" />
            <div>
              <p class="Author">{{ featuredBook.author }}</p>
              <p class="Title">{{ featuredBook.title }}</p>
              <p class="Price">{{ featuredBook.price }}</p>
            </div>
          </div>
        </v-col>
      </v-row>
      <div class="SpaceEmpty"></div>
    </v-container>

    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex align-center">
          <h1 class="flex-shrink-0 mr-5">Bestselling Books</h1>
          <hr class="w-100" />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          class="d-flex justify-center"
          lg="2"
          md="4"
          sm="4"
          v-for="bestSeller in bestSellers"
          :key="bestSeller.title"
        >
          <div class="FeatureItem">
            <img :src="bestSeller.url" class="FeatureImg" />
            <div>
              <p class="Author">{{ bestSeller.author }}</p>
              <p class="Title">{{ bestSeller.title }}</p>
              <p class="Price">{{ bestSeller.price }}</p>
            </div>
          </div>
        </v-col>
      </v-row>
      <div class="SpaceEmpty"></div>
    </v-container>

    <div class="Footer">
      <v-container>
        <v-row>
          <v-col lg="8" md="12" sm="12">
            <div class="FooterItem">
              <v-row>
                <v-col cols="3">
                  <p class="mb-3">www.example.com</p>
                  <p class="mb-3">Hai Phong, Vietnam</p>
                  <p>[+84] 123 456 789</p>
                </v-col>
                <v-col cols="3">
                  <p class="Title">About Us</p>
                  <p>About Us</p>
                  <p>Careers</p>
                  <p>Banners & Noble</p>
                </v-col>
                <v-col cols="3">
                  <p class="Title">Categories</p>
                  <p>Coupons</p>
                  <p>E-catalogs</p>
                  <p>Order Form</p>
                  <p>Blog</p>
                </v-col>
                <v-col cols="3">
                  <p class="Title">Quick Helps</p>
                  <p>Help Center</p>
                  <p>Order Status</p>
                  <p>Shipping & Returns</p>
                  <p>Covid Safety</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-icon class="IconFooter">mdi-facebook</v-icon>
                  <v-icon class="IconFooter">mdi-instagram</v-icon>
                  <v-icon class="IconFooter">mdi-twitter</v-icon>
                  <v-icon class="IconFooter">mdi-youtube</v-icon>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="d-flex justify-space-between">
                  <span> @CopyRight 2021 Bookie. All Rights Reserved </span>
                  <span> Site by Nguyen Hong Duyen </span>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col lg="4" md="12" sm="12">
            <div class="FooterItem">
              <h1 class="text-capitalize text-white mb-5">
                subscribe to our newsletter!
              </h1>
              <div class="d-flex">
                <v-text-field
                  label="Email Address"
                  variant="outlined"
                  rounded="lg"
                  class="mr-2"
                ></v-text-field>
                <v-btn color="white" size="large" class="mt-2">Subscribe</v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/store/authStore";
import { logout } from "@/utils/utils";

const store = useAuthStore();
const loading = false;

const onClick = () => {
  console.log("Clicked");
};

const categories = [
  {
    title: "Education Curriculum",
    url: "https://intamphuc.vn/wp-content/uploads/2023/06/mau-bia-sach-dep-2.jpg",
  },
  {
    title: "Fiction & Fantasy",
    url: "https://intamphuc.vn/wp-content/uploads/2023/06/mau-bia-sach-dep-4.jpg",
  },
  {
    title: "Religion & Spirituality",
    url: "https://intamphuc.vn/wp-content/uploads/2023/06/mau-bia-sach-dep-6.jpg",
  },
  {
    title: "Romance Books",
    url: "https://intamphuc.vn/wp-content/uploads/2023/06/mau-bia-sach-dep-7.jpg",
  },
  {
    title: "Literature & Fiction",
    url: "https://intamphuc.vn/wp-content/uploads/2023/06/mau-bia-sach-dep.8.jpg",
  },
  {
    title: "Biographies & Memoirs",
    url: "https://danviet.mediacdn.vn/upload/2-2015/images/2015-06-30/1436846015-tbdlbat_coc_2_ygdr.jpg",
  },
];

const featuredBooks = [
  {
    title: "The Sun, The Moon, The Stars",
    url: "https://hpconnect.vn/wp-content/uploads/2019/08/tam-quan-trong-cua-viec-thiet-ke-bia-sach-dep.jpg",
    author: "Junot Diaz",
    price: "$10",
  },
  {
    title: "The Da Vinci Code",
    url: "https://img.idesign.vn/2018/03/12/77839/idesign-nhung-thiet-ke-bia-sach-dep-nhat-danh-cho-nam-2018-01.jpg",
    author: "Da Vinci",
    price: "$15",
  },
  {
    title: "Ái tính nơi đầu lưỡi",
    url: "https://designs.vn/wp-content/images/30-05-2013/top%206_1.jpg",
    author: "Jo Kyung Ran",
    price: "$12",
  },
  {
    title: "Wink Poppy Midnight",
    url: "https://img.idesign.vn/2018/03/12/77839/idesign-nhung-thiet-ke-bia-sach-dep-nhat-danh-cho-nam-2018-05.jpg",
    author: "Wink",
    price: "$18",
  },
  {
    title: "Tử Huyệt Cảm Xúc",
    url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1495125645i/35167064.jpg",
    author: "Roy Garnett",
    price: "$14",
  },
  {
    title: "Lấp Lánh",
    url: "https://i.pinimg.com/originals/bf/eb/48/bfeb4898fd66d22e9741cb9830032a4f.jpg",
    author: "Ekuni Kaori",
    price: "$16",
  },
];

const bestSellers = [
  {
    title: "The Sun, The Moon, The Stars",
    url: "https://hpconnect.vn/wp-content/uploads/2019/08/tam-quan-trong-cua-viec-thiet-ke-bia-sach-dep.jpg",
    author: "Junot Diaz",
    price: "$10",
  },
  {
    title: "The Da Vinci Code",
    url: "https://img.idesign.vn/2018/03/12/77839/idesign-nhung-thiet-ke-bia-sach-dep-nhat-danh-cho-nam-2018-01.jpg",
    author: "Da Vinci",
    price: "$15",
  },
  {
    title: "Ái tính nơi đầu lưỡi",
    url: "https://designs.vn/wp-content/images/30-05-2013/top%206_1.jpg",
    author: "Jo Kyung Ran",
    price: "$12",
  },
  {
    title: "Wink Poppy Midnight",
    url: "https://img.idesign.vn/2018/03/12/77839/idesign-nhung-thiet-ke-bia-sach-dep-nhat-danh-cho-nam-2018-05.jpg",
    author: "Wink",
    price: "$18",
  },
  {
    title: "Tử Huyệt Cảm Xúc",
    url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1495125645i/35167064.jpg",
    author: "Roy Garnett",
    price: "$14",
  },
  {
    title: "Lấp Lánh",
    url: "https://i.pinimg.com/originals/bf/eb/48/bfeb4898fd66d22e9741cb9830032a4f.jpg",
    author: "Ekuni Kaori",
    price: "$16",
  },
];
</script>

<style scoped lang="scss">
.HomePage {
  background-color: #f5f5f5;
}

.Search {
  width: 500px;
}

.BorderBottom {
  border-bottom: 1px solid #cecece;
}

.Tab {
  font-weight: bold;
  font-size: 15px;
  text-transform: uppercase;
  padding: 0 15px;
}

.Tab:hover {
  cursor: pointer;
  color: #a287d7;
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
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 1) 17%,
    rgba(162, 135, 215, 0.5333333333333333) 100%
  );

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

.FeatureImg {
  height: 200px;
  width: 135px;
  border-radius: 10px;
}

.SpaceEmpty {
  height: 100px;
}

.Footer {
  background-color: #a287d7;
  color: white;
  font-size: 14px;
  color: #e7d5fa;

  .Title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 10px;
  }

  .IconFooter {
    font-size: 40px;
    margin-right: 20px;
    color: #fff;
  }

  .FooterItem {
    border: 1px solid white;
    border-radius: 20px;
    margin: 20px 0;
    padding: 20px 30px;
  }
}
</style>
