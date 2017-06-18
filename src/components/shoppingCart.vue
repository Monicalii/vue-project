<template>
  <div class="shoppingCart">
    <div class="container">
      <div class="cart">
        <div class="checkout-title">
          <span>购物车</span>
        </div>

        <!-------- table ------>
        <div class="item-list-wrap">
          <div class="cart-item">
            <div class="cart-item-head">
              <ul>
                <li>商品信息</li>
                <li>商品金额</li>
                <li>商品数量</li>
                <li>总金额</li>
                <li>编辑</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="(item,index) in productList">
                <div class="cart-tab-1">
                  <div class="cart-item-check">
                    <a href="javascript:void 0" class="item-check-btn" :class="{'check':item.checked}" @click="selectProduct(item)">
                      <svg class="icon icon-ok">
                        <use xlink:href="#icon-ok"></use>
                      </svg>
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img :src="item.productImage" :alt="item.productName">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>
                  </div>
                  <div class="item-include">
                    <dl>
                      <dt>赠送:</dt>
                      <dd v-for="(part,index) in item.parts">
                        <div class="partContent">
                          <div class="left">
                            <img style="width:50px" :src="part.imgSrc" />
                          </div>
                          <div class="right">
                            <span>{{part.partsName}}</span>
                          </div>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.productPrice | formatMoney('')}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self select-self-open">
                      <div class="quantity">
                        <a href="javascript:void 0" @click="changeQuantity(item,-1)">-</a>
                        <input type="text" :value="item.productQuantity" disabled>
                        <a href="javascript:void 0" @click="changeQuantity(item,1)">+</a>
                      </div>
                    </div>
                    <div class="item-stock">有货</div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{item.productPrice * item.productQuantity | formatMoney('元')}}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-operation">
                    <a href="javascript:void 0" class="item-edit-btn" @click="deleteConfirm(item)">
                      <svg class="icon icon-del">
                        <use xlink:href="#icon-del"></use>
                      </svg>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- footer -->
        <div class="cart-foot-wrap">
          <div class="cart-foot-l">
            <div class="item-all-check">
              <a href="javascript:void 0">
                <span class="item-check-btn" :class="{'check':isCheckAll}" @click="selectAll(true)">
									<svg class="icon icon-ok"><use xlink:href="#icon-ok"></use></svg>
								</span>
                <span v-show="!isCheckAll">全选</span>
              </a>
            </div>
            <div class="item-all-del">
              <a href="javascript:void 0" class="item-del-btn" @click="selectAll(false)">
                <span v-show="isCheckAll">取消全选</span>
              </a>
            </div>
          </div>
          <div class="cart-foot-r">
            <div class="item-total">
              合计: <span class="total-price">{{totalMoney | formatMoney('元')}}</span>
            </div>
            <div class="next-btn-wrap">
              <router-link to="/" class="btn btn--red" style="width: 200px">结账</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AXIOS from '../axios/axios'
const Axios = new AXIOS();
export default {
  name: 'shoppingCart',
  data () {
    return {
      productList: [],
      totalMoney: 0,
      isCheckAll: false,
      isDelete: false,
      curProduct: ''
    }
  },
  filters: {
    formatMoney(value, param){
      return "￥"+ value.toFixed(2) + param;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getCartList();
    });
  },
  methods: {
    getCartList (){
      let params = {
        api: 'static/axios/cartData.json',
        param: {}
      };
      Axios.get(params)
        .then( res => {
          this.productList = res.data.result.list;
        })
        .catch( err => {
          console.log(err);
        });
    },
    changeQuantity(product, type){
      if( type >0 ){
        product.productQuantity++;
      }else{
        product.productQuantity>1? product.productQuantity--: product.productQuantity = 1;
      }
      this.calcTotalMoney();
    },
    selectProduct(product){
      if( typeof product.checked == 'undefined' ){
        this.$set(product,"checked",true); 
      }else{
        product.checked = !product.checked;
      }
      this.calcTotalMoney();
    },
    selectAll(flag){
      this.isCheckAll = flag;
      this.productList.forEach((product,index) => {
        if( typeof product.checked == 'undefined' ){
          this.$set(product,"checked",this.isCheckAll);
        }else{
          product.checked = this.isCheckAll;
        }
      });
      this.calcTotalMoney();
    },
    calcTotalMoney(){
      this.totalMoney = 0;
      this.productList.forEach((product,index) => {
        if( product.checked ){
          this.totalMoney += product.productPrice * product.productQuantity
        }
      });
    },
    deleteConfirm(product){
      this.isDelete = true;
      this.curProduct = product;
    },
    deleteProduct(){
      let index = this.productList.indexOf(this.curProduct);
      this.productList.splice(index,1);
      this.isDelete = false;
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .quantity input {
    width: 40px;
    padding: 5px 10px;
    text-align: center;
  }
  
  .partContent {
    width: 130px;
    height: 50px;
  }
  
  .partContent .left {
    float: left;
    width: 50px;
    height: 50px;
    display: table-cell;
    vertical-align: middle;
    text-align: left;
  }
  
  .partContent .right {
    float: right;
    width: 65px;
    height: 50px;
    margin-left: 10px;
    cursor: pointer;
  }
</style>