{
  description = "Compiler for the strictly language";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
       let  packageName = "tree-sitter-strictly";
            forAllSystems = nixpkgs.lib.genAttrs [ "x86_64-linux"];
       in {
          packages = forAllSystems(system:
            let pkgs = nixpkgs.legacyPackages.${system};
                name = "strictly";

            in {
              default = pkgs.stdenv.mkDerivation {
                name = "tree-sitter-${name}";
                src = ./.;
                buildInputs = [ pkgs.tree-sitter pkgs.nodejs ];
                dontConfigure = true;

                FLAGS = [
                  "-Isrc"
                  "-g"
                  "-O3"
                  "-fPIC"
                  "-fno-exceptions"
                  "-Wl,-z,relro,-z,now"
                ];

                buildPhase = ''
                  runHook preBuild

                  tree-sitter generate --build --libdir=.

                  runHook postBuild
                '';

                installPhase = ''
                  runHook preInstall

                  mkdir -p $out/lib
                  mv *.so $out/lib

                  cp -r src $out
                  cp -r test $out
                  cp -r queries $out
                  cp package.json $out

                  runHook postInstall
                '';

                fixupPhase = ''
                  runHook preFixup

                  $STRIP $out/lib/${name}.so

                  runHook postFixup
                '';
              };
            }
          );
          apps = forAllSystems(system:
            {
              tree-sitter = {
                type = "app";
                program = "${nixpkgs.legacyPackages.${system}.tree-sitter}/bin/tree-sitter";
              };
            }
          );
          devShells = forAllSystems(system:
            let pkgs = nixpkgs.legacyPackages.${system};

            in {
              default =  pkgs.mkShell {
                buildInputs = [ pkgs.graphviz ];
              };
            }
          );
          checks = forAllSystems(system:
            let pkgs = nixpkgs.legacyPackages.${system};

            in {
              default = pkgs.stdenv.mkDerivation {
                name = "tree-sitter-strictly-test";
                dontUnpack = true;
                dontConfigure = true;
                buildInputs = [ pkgs.tree-sitter pkgs.nodejs self.packages.${system}.default ];
                buildPhase = ''
                  cd ${self.packages.${system}.default}
                  TREE_SITTER_LIBDIR=${self.packages.${system}.default}/lib tree-sitter test
                '';
                installPhase = ''
                  touch $out
                '';
              };
            }
         );
      };
}

