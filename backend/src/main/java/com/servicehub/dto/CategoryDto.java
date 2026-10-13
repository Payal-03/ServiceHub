package com.servicehub.dto;

public class CategoryDto {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private Boolean active;

    public CategoryDto() {
    }

    public CategoryDto(Long id, String name, String description, Boolean active) {
        this.id = id;
        this.name = name;
        this.slug = name != null ? name.toLowerCase().replaceAll("[^a-z0-9]+", "-") : "";
        this.description = description;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
        if (this.slug == null && name != null) {
            this.slug = name.toLowerCase().replaceAll("[^a-z0-9]+", "-");
        }
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
