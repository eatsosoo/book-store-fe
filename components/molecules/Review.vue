<template>
  <div class="ReviewComment">
    <div class="mx-4">
      <v-row class="BorderBottom mx-1 pb-5">
        <v-col cols="4">
          <h3>Tổng đánh giá</h3>
          <p class="TotalCommentText">{{ overviewRating.total_comments }}</p>
        </v-col>
        <v-col cols="4" class="AverageStar">
          <div class="mx-5">
            <h3>Đánh giá trung bình</h3>
            <div class="d-flex align-center mt-5">
              <h1 class="mr-2">
                {{ overviewRating.average_rating }}
              </h1>
              <v-rating
                v-model="overviewRating.average_rating"
                active-color="orange"
                color="orange-lighten-1"
                readonly
                density="compact"
                half-increments
                class="mr-4"
              ></v-rating>
            </div>
          </div>
        </v-col>
        <v-col cols="4">
          <div class="mx-5">
            <RatingBar
              :value="
                (overviewRating.star_ratings[0] /
                  overviewRating.total_comments) *
                100
              "
              star="5"
              color="green"
            ></RatingBar>

            <RatingBar
              :value="
                (overviewRating.star_ratings[1] /
                  overviewRating.total_comments) *
                100
              "
              star="4"
              color="indigo"
            ></RatingBar>

            <RatingBar
              :value="
                (overviewRating.star_ratings[2] /
                  overviewRating.total_comments) *
                100
              "
              star="3"
              color="orange"
            ></RatingBar>

            <RatingBar
              :value="
                (overviewRating.star_ratings[3] /
                  overviewRating.total_comments) *
                100
              "
              star="2"
              color="light-blue"
            ></RatingBar>

            <RatingBar
              :value="
                (overviewRating.star_ratings[4] /
                  overviewRating.total_comments) *
                100
              "
              star="1"
              color="error"
            ></RatingBar>
          </div>
        </v-col>
      </v-row>
    </div>

    <div
      v-for="review in pageState.items"
      :key="review.id"
      class="ReviewCommentItem"
      v-if="pageState.items.length > 0"
    >
      <v-row>
        <v-col cols="4" class="d-flex">
          <div class="mr-4 Avatar">
            <v-img :src="review.user_avatar_url" class="rounded-lg" />
          </div>
          <h4>{{ review.user_name }}</h4>
        </v-col>
        <v-col cols="8">
          <div class="d-flex align-center">
            <v-rating
              v-model="review.star"
              active-color="orange"
              color="orange-lighten-1"
              readonly
              density="compact"
              class="mr-4"
            ></v-rating>
            <span>{{ review.created_at.split(" ")[0] }}</span>
          </div>
          <p class="ml-2 mt-2 ReviewContent">{{ review.content }}</p>
        </v-col>
      </v-row>
    </div>
    <div v-else class="ReviewCommentItem text-center pt-5 text-grey">
      <h3>Không có đánh giá nào</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi, type ResponseResultType } from "~/composable/useApiFetch";

type Review = {
  id: number;
  content: string;
  star: number;
  user_id: number;
  book_id: number;
  parent_id: number;
  user_name: string;
  user_avatar_url: string;
  created_at: string;
  updated_at: string;
};

const props = defineProps<{
  bookId: {
    type: Number;
    required: true;
  };
}>();

const DEFAULT_SORT = [{ key: "id", order: "desc" }];
const pageState = reactive({
  itemsPerPage: 10,
  loading: true,
  totalItems: 0,
  items: [] as Review[],
  targetId: "",
  targetStatus: "",
  editId: "",
  sort: DEFAULT_SORT,
});

const overviewRating = reactive({
  average_rating: 0,
  total_comments: 0,
  star_ratings: [0, 0, 0, 0, 0],
});

const loadItems = async ({
  page,
  itemsPerPage,
  sortBy,
}: {
  page: number;
  itemsPerPage: number;
  sortBy: any;
}) => {
  pageState.loading = true;
  pageState.sort = sortBy;

  const { api } = useApi(undefined, "GET", null, undefined);
  let paging = "";
  let sorting = "";

  if (page && itemsPerPage) {
    paging = "pagination=" + JSON.stringify({ page, per_page: itemsPerPage });
  }

  if (sortBy && sortBy.length) {
    sorting += "&sort=" + JSON.stringify(sortBy[0]);
  } else {
    sorting += "&sort=" + JSON.stringify(DEFAULT_SORT[0]);
  }

  const { data: responseData } = await api<ResponseResultType>(
    `/comments?book_id=${props.bookId}&` + paging + sorting
  );

  if (!responseData) {
    pageState.items = [];
  }

  if (responseData.value) {
    const { comments, pagination } = responseData.value.data;
    pageState.items = comments;
    pageState.totalItems = pagination.total;
  }

  pageState.loading = false;
};

const getOverviewRating = async () => {
  const { api } = useApi(undefined, "GET", null, undefined);
  const { data: responseData } = await api<ResponseResultType>(
    `/comments/${props.bookId}/rating`
  );

  if (!responseData) {
    overviewRating.average_rating = 0;
    overviewRating.total_comments = 0;
    overviewRating.star_ratings = [0, 0, 0, 0, 0];
  }

  if (responseData.value) {
    const { average_rating, total_comments, star_ratings } =
      responseData.value.data.rating;
    overviewRating.average_rating = average_rating;
    overviewRating.total_comments = total_comments;
    overviewRating.star_ratings = star_ratings;
  }
};

getOverviewRating();
loadItems({ page: 1, itemsPerPage: 10, sortBy: DEFAULT_SORT });
</script>

<style lang="scss">
.ReviewComment {
  padding: 20px 20px 0;
}

.BorderBottom {
  border-bottom: 2px solid #f5f5f6;
}

.ReviewCommentItem {
  border-bottom: 2px solid #f5f5f6;
  padding: 0 0 20px;
  margin: 20px 20px;
}

.ReviewContent {
  color: #646673;
}

.Avatar {
  width: 80px;
  height: 80px;
  border-radius: 10px;
}

.AverageStar {
  border-right: 2px solid #f5f5f6;
  border-left: 2px solid #f5f5f6;
}

.TotalCommentText {
  font-size: 50px;
  font-weight: 500;
}
</style>
