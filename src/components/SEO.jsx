import { useEffect } from "react";

function SEO({
    title,
    description,
    canonical,
    noIndex = false,
    structuredData = null,
}) {

    useEffect(() => {

        document.title = title;


        // =====================================================
        // META DESCRIPTION
        // =====================================================

        let metaDescription =
            document.querySelector(
                'meta[name="description"]'
            );

        if (!metaDescription) {

            metaDescription =
                document.createElement("meta");

            metaDescription.setAttribute(
                "name",
                "description"
            );

            document.head.appendChild(
                metaDescription
            );

        }

        metaDescription.setAttribute(
            "content",
            description
        );


        // =====================================================
        // ROBOTS
        // =====================================================

        let robots =
            document.querySelector(
                'meta[name="robots"]'
            );

        if (!robots) {

            robots =
                document.createElement("meta");

            robots.setAttribute(
                "name",
                "robots"
            );

            document.head.appendChild(
                robots
            );

        }

        robots.setAttribute(
            "content",
            noIndex
                ? "noindex, nofollow"
                : "index, follow, max-image-preview:large"
        );


        // =====================================================
        // CANONICAL
        // =====================================================

        let canonicalLink =
            document.querySelector(
                'link[rel="canonical"]'
            );

        if (!canonicalLink) {

            canonicalLink =
                document.createElement("link");

            canonicalLink.setAttribute(
                "rel",
                "canonical"
            );

            document.head.appendChild(
                canonicalLink
            );

        }

        canonicalLink.setAttribute(
            "href",
            canonical
        );


        // =====================================================
        // OPEN GRAPH
        // =====================================================

        const setMetaProperty = (
            property,
            content
        ) => {

            let meta =
                document.querySelector(
                    `meta[property="${property}"]`
                );

            if (!meta) {

                meta =
                    document.createElement("meta");

                meta.setAttribute(
                    "property",
                    property
                );

                document.head.appendChild(
                    meta
                );

            }

            meta.setAttribute(
                "content",
                content
            );

        };


        setMetaProperty(
            "og:title",
            title
        );

        setMetaProperty(
            "og:description",
            description
        );

        setMetaProperty(
            "og:url",
            canonical
        );

        setMetaProperty(
            "og:type",
            "website"
        );

        setMetaProperty(
            "og:site_name",
            "Sigma Classes"
        );

        setMetaProperty(
            "og:locale",
            "en_IN"
        );


        // =====================================================
        // TWITTER / X
        // =====================================================

        const setMetaName = (
            name,
            content
        ) => {

            let meta =
                document.querySelector(
                    `meta[name="${name}"]`
                );

            if (!meta) {

                meta =
                    document.createElement("meta");

                meta.setAttribute(
                    "name",
                    name
                );

                document.head.appendChild(
                    meta
                );

            }

            meta.setAttribute(
                "content",
                content
            );

        };


        setMetaName(
            "twitter:title",
            title
        );

        setMetaName(
            "twitter:description",
            description
        );

        setMetaName(
            "twitter:card",
            "summary_large_image"
        );


        // =====================================================
        // STRUCTURED DATA
        // =====================================================

        const existingSchema =
            document.querySelector(
                'script[data-seo-schema="true"]'
            );

        if (existingSchema) {

            existingSchema.remove();

        }


        if (structuredData) {

            const schemaScript =
                document.createElement("script");

            schemaScript.setAttribute(
                "type",
                "application/ld+json"
            );

            schemaScript.setAttribute(
                "data-seo-schema",
                "true"
            );

            schemaScript.textContent =
                JSON.stringify(
                    structuredData
                );

            document.head.appendChild(
                schemaScript
            );

        }


        // =====================================================
        // CLEANUP
        // =====================================================

        return () => {

            const schema =
                document.querySelector(
                    'script[data-seo-schema="true"]'
                );

            if (schema) {

                schema.remove();

            }

        };

    }, [
        title,
        description,
        canonical,
        noIndex,
        structuredData,
    ]);


    return null;
}


export default SEO;