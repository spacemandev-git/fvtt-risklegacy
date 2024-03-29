export class MissionItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["risk", "territory", "coin"],
      template: "systems/risklegacy/templates/img_horizontal.html",
      width: 635,
      height: 448,
    });
  }

  /** @override */
  getData() {
    const data = super.getData();
    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
  }

  _updateObject(event, formData) {
    this.object.update(formData);
  }
}
