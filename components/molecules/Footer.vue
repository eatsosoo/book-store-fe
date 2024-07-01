<template>
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
                <p class="Title">Về chúng tôi</p>
                <p>Về chúng tôi</p>
                <p>Sự nghiệp</p>
                <p>Banners & Noble</p>
              </v-col>
              <v-col cols="3">
                <p class="Title">Danh mục</p>
                <p>Mã giảm giá</p>
                <p>E-catalogs</p>
                <p>Biểu mẫu đặt hàng</p>
                <p>Blog</p>
              </v-col>
              <v-col cols="3">
                <p class="Title">Trợ giúp nhanh</p>
                <p>Trung tâm trợ giúp</p>
                <p>Tình trạng đơn hàng</p>
                <p>Vận chuyển & Trả hàng</p>
                <p>An toàn Covid</p>
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
                <span> @CopyRight 2024 Bookie. All Rights Reserved </span>
                <span> Trang web được tạo bởi Nguyễn Hồng Duyên </span>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col lg="4" md="12" sm="12">
          <div class="FooterItem">
            <h1 class="text-capitalize text-white mb-5">
              đăng ký nhận bản tin của chúng tôi!
            </h1>
            <div class="d-flex">
              <v-text-field
                label="Địa chỉ Email"
                variant="outlined"
                rounded="lg"
                class="mr-2"
              ></v-text-field>
              <v-btn color="white" size="large" class="mt-2">Đăng ký</v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss">
.Link {
  text-decoration: none;
  color: inherit;

  i {
    color: #a287d7;
  }
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
    height: 270px;
  }
}
</style>
