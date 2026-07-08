import { describe, expect, it } from "vitest";

import { mount, flushPromises } from '@vue/test-utils'

import FormMovie from "../components/FormMovie.vue";

describe("FormMovie", () => {
  it("fill hợp lệ và submit thì emit payload đúng", async () => {
    const wrapper = mount(FormMovie);

    await wrapper.find('[data-test="title-input"]').setValue("Inception");
    await wrapper.find('[data-test="director-input"]').setValue("Christopher Nolan");
    await wrapper.find('[data-test="year-input"]').setValue("2010");
    await wrapper.find('[data-test="genre-input"]').setValue("Sci-Fi");
    await wrapper.find('[data-test="rating-input"]').setValue("8.8");
    await wrapper.find('[data-test="description-input"]').setValue("Dream sharing movie");

    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.emitted("submit")).toBeTruthy();
    expect(wrapper.emitted("submit")[0][0]).toEqual({
      title: "Inception",
      director: "Christopher Nolan",
      year: 2010,
      genre: "Sci-Fi",
      rating: 8.8,
      description: "Dream sharing movie",
    });
  });

  it("fill sai title rỗng thì form invalid và không emit", async () => {
    const wrapper = mount(FormMovie);

    await wrapper.find('[data-test="title-input"]').setValue("");
    await wrapper.find('[data-test="director-input"]').setValue("Christopher Nolan");
    await wrapper.find('[data-test="year-input"]').setValue("2010");
    await wrapper.find('[data-test="rating-input"]').setValue("8.8");

    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.vm.v$.$invalid).toBe(true);
    expect(wrapper.emitted("submit")).toBeFalsy();
  });
});
