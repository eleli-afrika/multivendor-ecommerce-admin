name: deploy ecommerce_admin

on:
  push:
    branches: [main]
    
env:
  IMAGE_NAME: ${{ secrets.DOCR_REGISTRY }}/ecommerce_admin


jobs:
  create-deployment:
    name: build and push image
    runs-on: ubuntu-latest
    outputs:
      image_tag: ${{ steps.image_meta.outputs.tag }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: resolve image tag
        id: image_meta
        run: |
          TAG=$(git describe --tags --abbrev=0 2>/dev/null || true)
          if [ -z "$TAG" ]; then
            TAG="main-${GITHUB_SHA::7}"
          fi
          echo "tag=$TAG" >> "$GITHUB_OUTPUT"

      - name: Load env file from secret
        run: |
          printf "%s" "${{ secrets.MAIN_ENV_FILE }}" > .env
          sed -i 's/\r$//' .env

          # login first 
      - name: login to container registry
        uses: docker/login-action@v3
        with:
          registry: ${{ secrets.DOCR_REGISTRY }}
          username: ${{ secrets.DOCR_USERNAME }}
          password: ${{ secrets.DOCR_TOKEN }}    

      - name: build image
        env:
          DOCKER_BUILDKIT: 1
        run: |
          echo '${{ secrets.MAIN_ENV_FILE }}' > .env
          docker build \
            # --secret id=MAIN_ENV_FILE,src=.env \
            --tag "${IMAGE_NAME}:${{ steps.image_meta.outputs.tag }}" \
            .

    
      - name: push image
        run: |
          docker push "${IMAGE_NAME}:${{ steps.image_meta.outputs.tag }}"

