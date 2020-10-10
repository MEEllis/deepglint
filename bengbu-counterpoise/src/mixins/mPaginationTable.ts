import { Vue, Component, Watch } from "vue-property-decorator";

@Component
export default class MPaginationTable extends Vue {
  public pageParams = {
    Limit: 20,
    Offset: 0,
  };
  public Total = 0;

  public getIndex(index: number) {
    return this.pageParams.Offset + index + 1;
  }
  //定义查询的实现，调用类重写该方法
  public search() {}

  @Watch("pageParams", { deep: true })
  private onPageParamsChanged(val: number) {
    this.search();
  }
}
